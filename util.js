'use strict';

/**
 * Registers listeners that produce output on process termination
 *
 * @param logger
 * @param moduleName
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerExitListeners = registerExitListeners;
function registerExitListeners(logger) {
  var moduleName = arguments.length <= 1 || arguments[1] === undefined ? 'module' : arguments[1];

  process.on('SIGTERM', function () {
    logger.verbose('------ ' + module + ' exiting via SIGTERM ------');
    process.exit();
  });

  process.on('SIGINT', function () {
    logger.verbose('------ ' + module + ' exiting via SIGINT ------');
    process.exit();
  });

  process.on('exit', function (code) {
    logger.info('++++++ ' + module + ' exiting with code ' + code + ' ++++++');
  });

  logger.debug('Exit listeners registered.');
}