const moment = require('moment')
const path = require('path')
const winston = require('winston')

const formatter = (opts) => `[${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}] [${opts.level}] ${opts.message}`

/**
 * Creates a new logger instance
 *
 * @param {Object} cfg Configuration object
 * @param {String|Boolean} cfg.console Log level for console/stdout logging (set to false to disable)
 * @param {Object} cfg.files Configuration for file logging
 * @param {string} cfg.files.baseDir Base dir for log files
 * @param {Array.<{name: String, level: String}>} cfg.files.logFiles Configuration for file logging
 *
 * @returns {Object}
 */
function createLogger (cfg = { }) {
  const { console, files } = cfg // Destructuring here instead of in arg list to stop IDE from complaining about jsdoc not matching args

  let logger = new winston.Logger()

  if (console) {
    logger.add(winston.transports.Console, {
      level: console,
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

module.exports = {
  createLogger,
  formatter
}
