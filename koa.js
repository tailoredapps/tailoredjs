'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRequestProfilerMiddleware = getRequestProfilerMiddleware;
exports.getErrorHandlerMiddleware = getErrorHandlerMiddleware;

var _util = require('./util');

/**
 * Returns a request profiler middleware function for use in koa 2.x
 *
 * @param logger
 * @returns {profileRequest}
 */
function getRequestProfilerMiddleware(logger) {
  return function profileRequest(ctx, next) {
    var requestStart, elapsed;
    return regeneratorRuntime.async(function profileRequest$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            requestStart = new Date();
            _context.next = 3;
            return regeneratorRuntime.awrap(next());

          case 3:
            elapsed = (0, _util.getDuration)(requestStart).toFixed(4);


            if (ctx.status >= 400) {
              logger.warn(ctx.method + ' ' + ctx.url + ' finished with ' + ctx.status + ' error, took ' + elapsed + ' sec.');
            } else {
              logger.info(ctx.method + ' ' + ctx.url + ' finished without error, took ' + elapsed + ' sec.');
            }

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, null, this);
  };
}

/**
 * Returns an error handler middleware function for use in koa 2.x
 *
 * @param logger
 * @returns {handleError}
 */
function getErrorHandlerMiddleware(logger) {
  return function handleError(ctx, next) {
    return regeneratorRuntime.async(function handleError$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(next());

          case 3:
            _context2.next = 11;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2['catch'](0);

            logger.error(_context2.t0.message);
            logger.debug(_context2.t0.stack);

            ctx.status = _context2.t0.status || _context2.t0.statusCode || 500;
            ctx.body = _context2.t0.message;

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, this, [[0, 5]]);
  };
}