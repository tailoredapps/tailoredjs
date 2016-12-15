'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.METHOD_DELETE = exports.METHOD_PUT = exports.METHOD_PATCH = exports.METHOD_POST = exports.METHOD_GET = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getRequestSpec = getRequestSpec;
exports.default = getConnector;

var _util = require('./util');

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var METHOD_GET = exports.METHOD_GET = 'get';
var METHOD_POST = exports.METHOD_POST = 'post';
var METHOD_PATCH = exports.METHOD_PATCH = 'patch';
var METHOD_PUT = exports.METHOD_PUT = 'put';
var METHOD_DELETE = exports.METHOD_DELETE = 'delete';

var allowedMethods = [METHOD_GET, METHOD_POST, METHOD_PATCH, METHOD_PUT, METHOD_DELETE];

function getRequestSpec(baseUrl, endpoint, params) {
  var route = endpoint.route,
      method = endpoint.method,
      doReplace = endpoint.doReplace,
      getPath = endpoint.getPath,
      getQuery = endpoint.getQuery,
      getBody = endpoint.getBody,
      _endpoint$json = endpoint.json,
      json = _endpoint$json === undefined ? true : _endpoint$json,
      opts = _objectWithoutProperties(endpoint, ['route', 'method', 'doReplace', 'getPath', 'getQuery', 'getBody', 'json']);

  var canHaveBody = method === METHOD_PATCH || method === METHOD_POST || method === METHOD_PUT;

  var qs = getQuery ? getQuery(params) : !canHaveBody ? params : {};

  var uri = getPath ? getPath(route, params) : doReplace ? (0, _util.replaceTokens)(route, params) : route;

  var body = canHaveBody ? getBody ? getBody(params) : params : undefined;

  return _extends({
    baseUrl: baseUrl,
    method: method,
    uri: uri,
    qs: qs,
    body: body,
    json: json
  }, opts);
}

function getConnector(_ref) {
  var _this = this;

  var baseUrl = _ref.baseUrl,
      endpointSpecs = _ref.endpoints,
      logger = _ref.logger,
      _ref$requestFn = _ref.requestFn,
      requestFn = _ref$requestFn === undefined ? _requestPromise2.default : _ref$requestFn;

  if (!baseUrl || typeof baseUrl !== 'string' || baseUrl.length === 0 || !endpointSpecs || !Array.isArray(endpointSpecs) || endpointSpecs.length === 0) {
    throw new Error('Invalid arguments passed to getConnector()');
  }

  if (endpointSpecs.some(function (_ref2) {
    var id = _ref2.id,
        route = _ref2.route,
        method = _ref2.method;
    return !id || !route || !method || !allowedMethods.includes(method.toLowerCase());
  })) {
    logger.debug('Endpoint specs: %s', JSON.stringify(endpointSpecs));

    throw new Error('Invalid endpoint specification encountered.');
  }

  var endpoints = new Map(endpointSpecs.map(function (_ref3) {
    var id = _ref3.id,
        route = _ref3.route,
        method = _ref3.method,
        props = _objectWithoutProperties(_ref3, ['id', 'route', 'method']);

    return [id, _extends({ route: route, method: method.toLowerCase(), doReplace: route.includes('{') }, props)];
  }));
  var getSpec = function getSpec() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return getRequestSpec.apply(undefined, [baseUrl].concat(args));
  };

  return function _callee(endpointId, params) {
    var requestOptions;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(!endpointId || !endpoints.has(endpointId))) {
              _context.next = 2;
              break;
            }

            throw new Error('Invalid endpoint id "' + endpointId + '" provided.');

          case 2:
            requestOptions = getSpec(endpoints.get(endpointId), params);
            _context.next = 5;
            return regeneratorRuntime.awrap(requestFn(requestOptions));

          case 5:
            return _context.abrupt('return', _context.sent);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, null, _this);
  };
}