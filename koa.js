'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.requestProfiler = requestProfiler;
exports.errorHandler = errorHandler;
exports.requestDigester = requestDigester;

var _util = require('./util');

function requestProfiler(logger) {
  return function profileRequest(ctx, next) {
    var requestStart, elapsed;
    return regeneratorRuntime.async(function profileRequest$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            logger.debug(ctx.method + ' ' + ctx.url + ' starting');

            requestStart = new Date();
            _context.next = 4;
            return regeneratorRuntime.awrap(next());

          case 4:
            elapsed = (0, _util.getDuration)(requestStart).toFixed(4);


            if (ctx.status >= 400) {
              logger.warn(ctx.method + ' ' + ctx.url + ' finished with ' + ctx.status + ' error, took ' + elapsed + ' sec.');
            } else {
              logger.info(ctx.method + ' ' + ctx.url + ' finished without error, took ' + elapsed + ' sec.');
            }

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, null, this);
  };
}

function errorHandler(logger, modifyMessage) {
  return function handleError(ctx, next) {
    var message, error, body, stack, content, response;
    return regeneratorRuntime.async(function handleError$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(next());

          case 3:
            _context2.next = 14;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2['catch'](0);
            message = _context2.t0.message, error = _context2.t0.error, body = _context2.t0.body, stack = _context2.t0.stack;
            content = body || error || message;
            response = modifyMessage ? modifyMessage(content, ctx) : content;


            logger.error((typeof response === 'undefined' ? 'undefined' : _typeof(response)) === 'object' ? JSON.stringify(response) : response);
            logger.debug(stack);

            ctx.status = _context2.t0.status || _context2.t0.statusCode || 500;
            ctx.body = response;

          case 14:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, this, [[0, 5]]);
  };
}

function requestDigester(logger) {
  var methodPropName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'digestMethod';

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
            return _context3.abrupt('return');

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