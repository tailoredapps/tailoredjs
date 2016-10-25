'use strict'

import { getDuration } from './util'

/**
 * Returns a request profiler middleware function for use in koa 2.x
 *
 * @param logger
 * @returns {profileRequest}
 */
export function getRequestProfilerMiddleware (logger) {
  return async function profileRequest (ctx, next) {
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
 *
 * @param logger
 * @returns {handleError}
 */
export function getErrorHandlerMiddleware (logger) {
  return async function handleError (ctx, next) {
    try {
      await next()
    } catch (err) {
      const { message, stack } = err

      logger.error(typeof message === 'object' ? JSON.stringify(message) : message)
      logger.debug(stack)

      ctx.status = err.status || err.statusCode || 500
      ctx.body = err.message
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
export function getRequestDigesterMiddleware (logger, methodPropName = 'digestMethod') {
  return async function digestRequest (ctx, next) {
    const digestMethod = ctx.state[methodPropName]

    if (!digestMethod) {
      logger.warn(`No "digest" method set for request ${ctx.method} ${ctx.url}.`)

      return await next()
    }

    logger.debug('Calling digest method now.')

    ctx.body = await digestMethod(ctx)

    logger.debug('digest method call successful.')

    ctx.status = ctx.body ? 200 : 204

    await next()
  }
}
