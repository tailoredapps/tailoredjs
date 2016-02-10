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

/**
 * Simple Promise based wrapper class for the "request" package.
 * Also converts timeout errors into 504 Gateway Timeout.
 *
 * @class
 */

var HttpRequest = function () {
  /**
   * Create a new HttpRequest instance
   *
   * @param {string|object} opts Options passed directly to the "request" method.
   */

  function HttpRequest(opts) {
    _classCallCheck(this, HttpRequest);

    this.opts = opts;
    this.defaultTimeout = 60; // Sensible default value, can be overridden by simply extending this class
  }

  _createClass(HttpRequest, [{
    key: 'send',

    /**
     * Sends the request.
     *
     * @returns {Promise}
     */
    value: function send() {
      return (0, _requestPromise2.default)(this.requestOptions)
      // Throw a proper 504 error when the remote backend times out
      .catch(function (error) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9yZXF1ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBV1MsV0FBVzs7Ozs7OztBQU05QixXQU5tQixXQUFXLENBTWpCLElBQUksRUFBRTswQkFOQSxXQUFXOztBQU81QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtBQUNoQixRQUFJLENBQUMsY0FBYyxHQUFHLEVBQUU7QUFBQSxHQUN6Qjs7ZUFUa0IsV0FBVzs7Ozs7Ozs7MkJBZ0N0QjtBQUNOLGFBQU8sOEJBQVEsSUFBSSxDQUFDLGNBQWM7O0FBQUMsT0FFaEMsS0FBSyxDQUFDLFVBQUEsS0FBSztlQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxXQUFXLEdBQUcsMEJBQVksR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO09BQUEsQ0FBQyxDQUFBO0tBQzlHOzs7d0JBekJxQjtBQUNwQixVQUFJLElBQUksR0FBRyxFQUFFLENBQUE7O0FBRWIsVUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQ2pDLFlBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtPQUNyQixNQUFNO0FBQ0wsY0FBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO09BQy9COztBQUVELFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQTtPQUNuQzs7QUFFRCxhQUFPLElBQUksQ0FBQTtLQUNaOzs7U0F6QmtCLFdBQVc7OztrQkFBWCxXQUFXIiwiZmlsZSI6InJlcXVlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IGNyZWF0ZUVycm9yIGZyb20gJ2h0dHAtZXJyb3JzJ1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAncmVxdWVzdC1wcm9taXNlJ1xuXG4vKipcbiAqIFNpbXBsZSBQcm9taXNlIGJhc2VkIHdyYXBwZXIgY2xhc3MgZm9yIHRoZSBcInJlcXVlc3RcIiBwYWNrYWdlLlxuICogQWxzbyBjb252ZXJ0cyB0aW1lb3V0IGVycm9ycyBpbnRvIDUwNCBHYXRld2F5IFRpbWVvdXQuXG4gKlxuICogQGNsYXNzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh0dHBSZXF1ZXN0IHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBIdHRwUmVxdWVzdCBpbnN0YW5jZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IG9wdHMgT3B0aW9ucyBwYXNzZWQgZGlyZWN0bHkgdG8gdGhlIFwicmVxdWVzdFwiIG1ldGhvZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yIChvcHRzKSB7XG4gICAgdGhpcy5vcHRzID0gb3B0c1xuICAgIHRoaXMuZGVmYXVsdFRpbWVvdXQgPSA2MCAvLyBTZW5zaWJsZSBkZWZhdWx0IHZhbHVlLCBjYW4gYmUgb3ZlcnJpZGRlbiBieSBzaW1wbHkgZXh0ZW5kaW5nIHRoaXMgY2xhc3NcbiAgfVxuXG4gIGdldCByZXF1ZXN0T3B0aW9ucyAoKSB7XG4gICAgbGV0IG9wdHMgPSB7fVxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvcHRzLnVyaSA9IHRoaXMub3B0c1xuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3QuYXNzaWduKG9wdHMsIHRoaXMub3B0cylcbiAgICB9XG5cbiAgICBpZiAoIW9wdHMudGltZW91dCkge1xuICAgICAgb3B0cy50aW1lb3V0ID0gdGhpcy5kZWZhdWx0VGltZW91dFxuICAgIH1cblxuICAgIHJldHVybiBvcHRzXG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgdGhlIHJlcXVlc3QuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgc2VuZCAoKSB7XG4gICAgcmV0dXJuIHJlcXVlc3QodGhpcy5yZXF1ZXN0T3B0aW9ucylcbiAgICAvLyBUaHJvdyBhIHByb3BlciA1MDQgZXJyb3Igd2hlbiB0aGUgcmVtb3RlIGJhY2tlbmQgdGltZXMgb3V0XG4gICAgICAuY2F0Y2goZXJyb3IgPT4gUHJvbWlzZS5yZWplY3QoZXJyb3IuY2F1c2UgJiYgZXJyb3IuY2F1c2UuY29kZSA9PT0gJ0VUSU1FRE9VVCcgPyBjcmVhdGVFcnJvcig1MDQpIDogZXJyb3IpKVxuICB9XG59XG4iXX0=