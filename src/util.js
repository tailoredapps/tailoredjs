'use strict'

/**
 * Registers listeners that produce output on process termination
 *
 * @param logger
 * @param moduleName
 */
export function registerExitListeners (logger, moduleName = 'module') {
  process.on('SIGTERM', () => {
    logger.verbose(`------ ${module} exiting via SIGTERM ------`)
    process.exit()
  })

  process.on('SIGINT', () => {
    logger.verbose(`------ ${module} exiting via SIGINT ------`)
    process.exit()
  })

  process.on('exit', code => {
    logger.info(`++++++ ${module} exiting with code ${code} ++++++`)
  })

  logger.debug('Exit listeners registered.')
}
