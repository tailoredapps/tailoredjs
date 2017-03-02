'use strict'

import moment from 'moment'
import path from 'path'
import winston from 'winston'

const formatter = (opts) => `[${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}] [${opts.level}] ${opts.message}`

/**
 * Creates a new logger instance
 *
 * @param {Object} cfg Configuration object
 * @param {Object} cfg.destinations Logging destinations config object
 * @param {Object} cfg.destinations.console Configuration object for console/stdout logging
 * @param {Boolean} cfg.destinations.console.enable Enable or disable stdout logging
 * @param {String} cfg.destinations.console.level Log level for stdout logs
 * @param {Object} cfg.destinations.files Configuration for file logging
 * @param {string} cfg.destinations.files.baseDir Base dir for log files
 * @param {Array.<{name: String, level: String}>} cfg.destinations.files.logFiles Configuration for file logging
 *
 * @returns {Object}
 */
function createLogger (cfg = { }) {
  const { destinations: { console, files } = { } } = cfg // Destructuring here instead of in arg list to stop IDE from complaining about jsdoc not matching args

  let logger = new winston.Logger()

  if (console && console.enable) {
    logger.add(winston.transports.Console, {
      level: console.level,
      stderrLevels: [ 'error' ],
      formatter
    })
  }

  if (files) {
    const { baseDir = '.', logFiles } = files

    if (Array.isArray(logFiles)) {
      logFiles.forEach(({ name, level }) => {
        const fullPath = path.resolve(baseDir, name)

        logger.add(winston.transports.File, {
          level,
          formatter,
          filename: fullPath,
          name: fullPath, // winston needs a unique name for each transport
          json: false
        })
      })
    }
  }

  return logger
}

export default createLogger
export { formatter }
