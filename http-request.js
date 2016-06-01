'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultTimeout = 60 * 1000;

var HttpRequest = function () {
  function HttpRequest(opts) {
    _classCallCheck(this, HttpRequest);

    this.opts = opts;
    this.defaultTimeout = defaultTimeout;
  }

  _createClass(HttpRequest, [{
    key: 'send',
    value: function send() {
      return (0, _requestPromise2.default)(this.requestOptions).catch(function (error) {
        return Promise.reject(error.cause && error.cause.code === 'ETIMEDOUT' ? (0, _httpErrors2.default)(504) : error);
      });
    }
  }, {
    key: 'requestOptions',
    get: function get() {
      var opts = {};

      if (typeof this.opts === 'string') {
        opts.uri = this.opts;
      } else {
        Object.assign(opts, this.opts);
      }

      if (!opts.timeout) {
        opts.timeout = this.defaultTimeout;
      }

      return opts;
    }
  }]);

  return HttpRequest;
}();

exports.default = HttpRequest;