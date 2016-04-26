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
      logger.error(err.message)
      logger.debug(err.stack)

      ctx.status = err.status || err.statusCode || 500
      ctx.body = err.message
    }
  }
}
