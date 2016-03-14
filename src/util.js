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
