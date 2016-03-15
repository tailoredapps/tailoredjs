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
exports.getDuration = getDuration;
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

/**
 * Returns the difference between two Date objects in seconds - will instantiate a new Date object if no finish parameter is provided.
 *
 * @param start
 * @param finish
 */
function getDuration(start, finish) {
  return ((finish || new Date()) - start) / 1000;
}