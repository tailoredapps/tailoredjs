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

  function getListener(sig) {
    return function () {
      logger.verbose('---- ' + moduleName + ' exiting via ' + sig + ' ----');
      process.exit();
    };
  }
  process.on('SIGTERM', getListener('SIGTERM'));
  process.on('SIGINT', getListener('SIGINT'));

  process.on('exit', function (code) {
    logger.info('++++ ' + moduleName + ' exiting with code ' + code + ' ++++');
  });

  logger.debug('Exit listeners registered.');
}