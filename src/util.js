'use strict'

/**
 * Registers listeners that produce output on process termination
 *
 * @param logger
 * @param moduleName
 */
export function registerExitListeners (logger, moduleName = 'module') {
  function getListener (sig) {
    return () => {
      logger.verbose(`---- ${moduleName} exiting via ${sig} ----`)
      process.exit()
    }
  }
  process.on('SIGTERM', getListener('SIGTERM'))
  process.on('SIGINT', getListener('SIGINT'))

  process.on('exit', (code) => {
    logger.info(`++++ ${moduleName} exiting with code ${code} ++++`)
  })

  logger.debug('Exit listeners registered.')
}

/**
 * Returns the difference between two Date objects in seconds - will instantiate a new Date object if no finish parameter is provided.
 *
 * @param start
 * @param finish
 */
export function getDuration (start, finish) {
  return ((finish || new Date()) - start) / 1000
}
