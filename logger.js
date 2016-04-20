'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatter = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formatter = function formatter(opts) {
  return '[' + (0, _moment2.default)().format('YYYY-MM-DD HH:mm:ss.SSS') + '] [' + opts.level + '] ' + opts.message;
};

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
function createLogger(cfg) {
  if (!cfg) {
    cfg = {};
  }

  var destinations = cfg.destinations || {};

  var logger = new _winston2.default.Logger();

  if (destinations.console && destinations.console.enable) {
    logger.add(_winston2.default.transports.Console, {
      level: destinations.console.level,
      stderrLevels: ['error'],
      formatter: formatter
    });
  }

  if (destinations.files && Array.isArray(destinations.files)) {
    (function () {
      var baseDir = cfg.baseDir;

      destinations.files.forEach(function (f) {
        var filename = _path2.default.resolve(baseDir, f.name);

        logger.add(_winston2.default.transports.File, {
          filename: filename, formatter: formatter,
          level: f.level,
          name: filename, // winston needs a unique name for each transport
          json: false
        });
      });
    })();
  }

  return logger;
}

exports.default = createLogger;
exports.formatter = formatter;