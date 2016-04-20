'use strict'

import moment from 'moment'
import path from 'path'
import winston from 'winston'

const formatter = (opts) => `[${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}] [${opts.level}] ${opts.message}`

/**
 * Creates a new logger instance
 *
 * @param {Object} cfg Configuration object
 * @param {String} cfg.baseDir Base directory for all logfiles (optional, if file logging is disabled)
 * @param {Object} cfg.destinations Logging destinations config object
 * @param {Object} cfg.destinations.console Configuration object for console/stdout logging
 * @param {Boolean} cfg.destinations.console.enable Enable or disable stdout logging
 * @param {String} cfg.destinations.console.level Log level for stdout logs
 * @param {Array.<{name: String, level: String}>|Boolean} cfg.destinations.files Configuration for file logging - file logging is disabled entirely if this is false
 *
 * @returns {Object}
 */
function createLogger (cfg) {
  if (!cfg) {
    cfg = {}
  }

  const destinations = cfg.destinations || {}

  let logger = new winston.Logger()

  if (destinations.console && destinations.console.enable) {
    logger.add(winston.transports.Console, {
      level: destinations.console.level,
      stderrLevels: [ 'error' ],
      formatter
    })
  }

  if (destinations.files && Array.isArray(destinations.files)) {
    const baseDir = cfg.baseDir

    destinations.files.forEach(f => {
      const filename = path.resolve(baseDir, f.name)

      logger.add(winston.transports.File, {
        filename, formatter,
        level: f.level,
        name: filename, // winston needs a unique name for each transport
        json: false
      })
    })
  }

  return logger
}

export default createLogger
export { formatter }
