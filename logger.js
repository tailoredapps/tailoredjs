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

function createLogger() {
  var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var console = cfg.console,
      files = cfg.files;


  var logger = new _winston2.default.Logger();

  if (console) {
    logger.add(_winston2.default.transports.Console, {
      level: console,
      stderrLevels: ['error'],
      formatter: formatter
    });
  }

  if (files) {
    var _files$baseDir = files.baseDir,
        baseDir = _files$baseDir === undefined ? '.' : _files$baseDir,
        logFiles = files.logFiles;


    if (Array.isArray(logFiles)) {
      logFiles.forEach(function (_ref) {
        var name = _ref.name,
            level = _ref.level;

        var fullPath = _path2.default.resolve(baseDir, name);

        logger.add(_winston2.default.transports.File, {
          level: level,
          formatter: formatter,
          filename: fullPath,
          name: fullPath,
          json: false
        });
      });
    }
  }

  return logger;
}

exports.default = createLogger;
exports.formatter = formatter;