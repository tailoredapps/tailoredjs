'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerExitListeners = registerExitListeners;
exports.getDuration = getDuration;
exports.replaceTokens = replaceTokens;
exports.requireNodeEnv = requireNodeEnv;
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

function getDuration(start, finish) {
  return ((finish || new Date()) - start) / 1000;
}

function replaceTokens(str, replacements) {
  var tokenStart = arguments.length <= 2 || arguments[2] === undefined ? '{' : arguments[2];
  var tokenEnd = arguments.length <= 3 || arguments[3] === undefined ? '}' : arguments[3];

  return str.split(/(\{[a-z]+\})/i).map(function (part) {
    if (part.startsWith(tokenStart) && part.endsWith(tokenEnd)) {
      var token = part.substring(1, part.length - 1);

      if (typeof replacements[token] !== 'undefined') {
        return replacements[token];
      }
    }

    return part;
  }).join('');
}

function requireNodeEnv() {
  var errorMessage = arguments.length <= 0 || arguments[0] === undefined ? 'NODE_ENV environment variable is not set.' : arguments[0];

  if (!process.env.NODE_ENV) {
    throw new Error(errorMessage);
  }
}