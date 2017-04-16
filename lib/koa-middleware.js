const moment = require('moment')

const { getDuration } = require('./util')

/**
 * Returns a request profiler middleware function for use in koa 2.x
 *
 * @param logger
 * @returns {profileRequest}
 */
function requestProfiler (logger) {
  return async function profileRequest (ctx, next) {
    logger.debug(`${ctx.method} ${ctx.url} starting`)

    const requestStart = new Date()

    await next()

    const elapsed = getDuration(requestStart).toFixed(4)

    if (ctx.status >= 400) {
      logger.warn(`${ctx.method} ${ctx.url} finished with ${ctx.status} error, took ${elapsed} sec.`)
    } else {
      logger.info(`${ctx.method} ${ctx.url} finished without error, took ${elapsed} sec.`)
    }
  }
}

/**
 * Returns an error handler middleware function for use in koa 2.x
 * This function requires a logger instance being passed to it, and optionally supports modifying the error
 * message via a passed modifyMessage function, which will recieve the error message and the koa context as parameters.
 *
 * Contrived example:
 * app.use(getErrorHandlerMiddleware(myLoggerInstance, (message, ctx) => `${ctx.status} ERROR: ${message}`))
 *
 * @param logger
 * @param modifyMessage
 * @returns {handleError}
 */
function errorHandler (logger, modifyMessage) {
  return async function handleError (ctx, next) {
    try {
      await next()
    } catch (err) {
      const { message, error, body, stack } = err

      const content = body || error || message
      const response = modifyMessage ? modifyMessage(content, ctx) : content

      logger.error(typeof response === 'object' ? JSON.stringify(response) : response)
      logger.debug(stack)

      ctx.status = err.status || err.statusCode || 500
      ctx.body = response
    }
  }
}

/**
 * Returns a request digester middleware function for use in koa 2.x
 *
 * The basic idea here is for the router to do nothing but call a method that assigns a route specific function
 * to the request state (ctx.state.digestMethod = someAsyncFunc) - this method will subsequently be called by this
 * middleware, with the koa context object passed in. The function is expected to return an object, which will be
 * used as the response body. If the function doesn't return anything, a "204 No Content" response will automatically
 * be created.
 *
 * Example:
 *
 * async function respond ({ request: { body: { someBodyProp } } }) {
 *   return {
 *     someResponseProp: `Request body contained ${someBodyProp}.`
 *   }
 * }
 *
 * async function deleteSomething ({ params: { id } }) {
 *   await deleteThisIdFromDatabase(id)
 * }
 *
 * const router = new KoaRouter()
 *
 * router.post('/foo', async function setFooDigester (ctx, next) {
 *   ctx.state.digestMethod = respond
 *
 *   await next()
 * })
 *
 * router.delete('/bar/:id', async function setBarDigester (ctx, next) {
 *   ctx.state.digestMethod = deleteThings
 *
 *   await next()
 * })
 *
 * This will generate a "200 OK" response to "POST /foo" requests with the response body containing '{ someResponseProp: "Request body contained some request body value" }'.
 * "DELETE /bar/420" will delete the item "420" and return a "204 No Content" response.
 *
 * @param logger
 * @param methodPropName
 * @returns {digestRequest}
 */
function requestDigester (logger, methodPropName = 'digestMethod') {
  return async function digestRequest (ctx, next) {
    const digestMethod = ctx.state[methodPropName]

    if (!digestMethod) {
      logger.warn(`No "digest" method set for request ${ctx.method} ${ctx.url}.`)

      await next()
      return
    }

    logger.debug('Calling digest method now.')

    ctx.body = await digestMethod(ctx)

    logger.debug('digest method call successful.')

    ctx.status = ctx.body ? 200 : 204

    await next()
  }
}

/**
 * Provides a "setCacheLifetime" function on ctx.state
 * This function can be used by downstream middleware to easily set cache lifetime for the current request. Does not support
 * any advanced caching configuration on purpose, set headers manually if you need anything more than a simple "Cache-control"
 * or "Expires" header.
 *
 * API:
 * setCacheLifetime(lifetime[, useExpiresHeader = false]) => void
 *
 * Example:
 *
 * app.use(cacheLifetime(logger))
 * app.use(async (ctx, next) => {
 *   // do stuff here
 *
 *   ctx.state.setCacheLifetime(60) // -> response will include "Cache-control: max-age=60" header
 *   // or
 *   // ctx.state.setCacheLifetime(60, true) // -> response will contain "Expires: Mon, 17 Apr 2017 01:44:58 GMT" header
 *
 *   await next()
 * })
 *
 *
 * @param logger
 * @param defaultExpiresHeader
 * @param defaultLifetime
 * @param expiresHeader
 * @param cacheControlHeader
 * @returns {handleCacheLifetime}
 */
function cacheLifetime (logger, { defaultExpiresHeader = false, defaultLifetime = 0, expiresHeader = 'Expires', cacheControlHeader = 'Cache-control' } = { }) {
  return async function handleCacheLifetime (ctx, next) {
    ctx.state.setCacheLifetime = (lifetime, useExpiresHeader = defaultExpiresHeader) => {
      ctx.state.caching = { lifetime: parseInt(lifetime, 10), useExpiresHeader }
    }

    await next()

    if (!ctx.state.caching && defaultLifetime) {
      ctx.state.setCacheLifetime(defaultLifetime, defaultExpiresHeader)
    }

    const { lifetime, useExpiresHeader } = ctx.state.caching || { }

    if (lifetime && !isNaN(lifetime) && lifetime > 0) {
      const headerName = useExpiresHeader ? expiresHeader : cacheControlHeader
      const value = useExpiresHeader ? `${moment().locale('en').add(lifetime, 'seconds').utc().format('ddd, DD MMM YYYY HH:mm:ss')} GMT` : `max-age=${lifetime}`

      logger.verbose('Cache lifetime is %s sec → setting "%s" header to "%s".', lifetime, headerName, value)

      ctx.set(headerName, value)
    } else {
      logger.debug('No cache lifetime set.')
    }
  }
}

module.exports = {
  cacheLifetime,
  requestProfiler,
  errorHandler,
  requestDigester
}
