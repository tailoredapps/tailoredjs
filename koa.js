'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRequestProfilerMiddleware = getRequestProfilerMiddleware;
exports.getErrorHandlerMiddleware = getErrorHandlerMiddleware;
exports.getRequestDigesterMiddleware = getRequestDigesterMiddleware;

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

/**
 * Returns a request digester middleware function for use in koa 2.x
 *
 * The basic idea here is for the router to do nothing but call a method that assigns a route specific function
 * to the request state (ctx.state.digestMethod = someAsyncFunc) - this method will subsequently be called by this
 * middleware, with request body, route params, query, headers and full request object passed in. The function is
 * expected to return an object, which will be used as the response body. If the function doesn't return anything,
 * a "204 No Content" response will automatically be created.
 *
 * Example:
 *
 * async function respond ({ someBodyProp }) {
 *   return {
 *     someResponseProp: `Request body contained ${someBodyProp}.`
 *   }
 * }
 *
 * async function deleteSomething (body, { id }) {
 *   await deleteThisIdFromDatabase(id)
 * }
 *
 * const router = new KoaRouter()
 *
 * router.post('/foo', async function setFooDigester (ctx, next) {
 *   ctx.state.digestMethod = respond
 *
 *   await next()
 * })
 *
 * router.delete('/bar/:id', async function setBarDigester (ctx, next) {
 *   ctx.state.digestMethod = deleteThings
 *
 *   await next()
 * })
 *
 * This will generate a "200 OK" response to "POST /foo" requests with the response body containing '{ someResponseProp: "Request body contained some request body value" }'.
 * "DELETE /bar/420" will delete the item "420" and return a "204 No Content" response.
 *
 * @param logger
 * @param methodPropName
 * @returns {digestRequest}
 */
function getRequestDigesterMiddleware(logger) {
  var methodPropName = arguments.length <= 1 || arguments[1] === undefined ? 'digestMethod' : arguments[1];

  return function digestRequest(ctx, next) {
    var digestMethod;
    return regeneratorRuntime.async(function digestRequest$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            digestMethod = ctx.state[methodPropName];

            if (digestMethod) {
              _context3.next = 6;
              break;
            }

            logger.warn('No "digest" method set for request ' + ctx.method + ' ' + ctx.url + '.');

            _context3.next = 5;
            return regeneratorRuntime.awrap(next());

          case 5:
            return _context3.abrupt('return', _context3.sent);

          case 6:

            logger.debug('Calling digest method now.');

            _context3.next = 9;
            return regeneratorRuntime.awrap(digestMethod(ctx.request.body, ctx.params, ctx.query, ctx.headers, ctx));

          case 9:
            ctx.body = _context3.sent;


            logger.debug('digest method call successful.');

            ctx.status = ctx.body ? 200 : 204;

            _context3.next = 14;
            return regeneratorRuntime.awrap(next());

          case 14:
          case 'end':
            return _context3.stop();
        }
      }
    }, null, this);
  };
}