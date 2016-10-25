'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.getRequestProfilerMiddleware = getRequestProfilerMiddleware;
exports.getErrorHandlerMiddleware = getErrorHandlerMiddleware;
exports.getRequestDigesterMiddleware = getRequestDigesterMiddleware;

var _util = require('./util');

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

function getErrorHandlerMiddleware(logger) {
  return function handleError(ctx, next) {
    var message, stack;
    return regeneratorRuntime.async(function handleError$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(next());

          case 3:
            _context2.next = 13;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2['catch'](0);
            message = _context2.t0.message;
            stack = _context2.t0.stack;


            logger.error((typeof message === 'undefined' ? 'undefined' : _typeof(message)) === 'object' ? JSON.stringify(message) : message);
            logger.debug(stack);

            ctx.status = _context2.t0.status || _context2.t0.statusCode || 500;
            ctx.body = _context2.t0.message || _context2.t0.body;

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, this, [[0, 5]]);
  };
}

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
            return regeneratorRuntime.awrap(digestMethod(ctx));

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