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
    this.defaultTimeout = defaultTimeout; // Sensible default value, can be overridden by simply extending this class
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9odHRwLXJlcXVlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtaLElBQU0sY0FBYyxHQUFHLEVBQUUsR0FBRyxJQUFJOzs7Ozs7OztBQUFBO0lBUVgsV0FBVzs7Ozs7OztBQU05QixXQU5tQixXQUFXLENBTWpCLElBQUksRUFBRTswQkFOQSxXQUFXOztBQU81QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtBQUNoQixRQUFJLENBQUMsY0FBYyxHQUFHLGNBQWM7QUFBQSxHQUNyQzs7ZUFUa0IsV0FBVzs7Ozs7Ozs7MkJBZ0N0QjtBQUNOLGFBQU8sOEJBQVEsSUFBSSxDQUFDLGNBQWM7O0FBQUMsT0FFaEMsS0FBSyxDQUFDLFVBQUEsS0FBSztlQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxXQUFXLEdBQUcsMEJBQVksR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO09BQUEsQ0FBQyxDQUFBO0tBQzlHOzs7d0JBekJxQjtBQUNwQixVQUFJLElBQUksR0FBRyxFQUFFLENBQUE7O0FBRWIsVUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQ2pDLFlBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtPQUNyQixNQUFNO0FBQ0wsY0FBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO09BQy9COztBQUVELFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQTtPQUNuQzs7QUFFRCxhQUFPLElBQUksQ0FBQTtLQUNaOzs7U0F6QmtCLFdBQVc7OztrQkFBWCxXQUFXIiwiZmlsZSI6Imh0dHAtcmVxdWVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgY3JlYXRlRXJyb3IgZnJvbSAnaHR0cC1lcnJvcnMnXG5pbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0LXByb21pc2UnXG5cbmNvbnN0IGRlZmF1bHRUaW1lb3V0ID0gNjAgKiAxMDAwXG5cbi8qKlxuICogU2ltcGxlIFByb21pc2UgYmFzZWQgd3JhcHBlciBjbGFzcyBmb3IgdGhlIFwicmVxdWVzdFwiIHBhY2thZ2UuXG4gKiBBbHNvIGNvbnZlcnRzIHRpbWVvdXQgZXJyb3JzIGludG8gNTA0IEdhdGV3YXkgVGltZW91dC5cbiAqXG4gKiBAY2xhc3NcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHR0cFJlcXVlc3Qge1xuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IEh0dHBSZXF1ZXN0IGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gb3B0cyBPcHRpb25zIHBhc3NlZCBkaXJlY3RseSB0byB0aGUgXCJyZXF1ZXN0XCIgbWV0aG9kLlxuICAgKi9cbiAgY29uc3RydWN0b3IgKG9wdHMpIHtcbiAgICB0aGlzLm9wdHMgPSBvcHRzXG4gICAgdGhpcy5kZWZhdWx0VGltZW91dCA9IGRlZmF1bHRUaW1lb3V0IC8vIFNlbnNpYmxlIGRlZmF1bHQgdmFsdWUsIGNhbiBiZSBvdmVycmlkZGVuIGJ5IHNpbXBseSBleHRlbmRpbmcgdGhpcyBjbGFzc1xuICB9XG5cbiAgZ2V0IHJlcXVlc3RPcHRpb25zICgpIHtcbiAgICBsZXQgb3B0cyA9IHt9XG5cbiAgICBpZiAodHlwZW9mIHRoaXMub3B0cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG9wdHMudXJpID0gdGhpcy5vcHRzXG4gICAgfSBlbHNlIHtcbiAgICAgIE9iamVjdC5hc3NpZ24ob3B0cywgdGhpcy5vcHRzKVxuICAgIH1cblxuICAgIGlmICghb3B0cy50aW1lb3V0KSB7XG4gICAgICBvcHRzLnRpbWVvdXQgPSB0aGlzLmRlZmF1bHRUaW1lb3V0XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdHNcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyB0aGUgcmVxdWVzdC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBzZW5kICgpIHtcbiAgICByZXR1cm4gcmVxdWVzdCh0aGlzLnJlcXVlc3RPcHRpb25zKVxuICAgIC8vIFRocm93IGEgcHJvcGVyIDUwNCBlcnJvciB3aGVuIHRoZSByZW1vdGUgYmFja2VuZCB0aW1lcyBvdXRcbiAgICAgIC5jYXRjaChlcnJvciA9PiBQcm9taXNlLnJlamVjdChlcnJvci5jYXVzZSAmJiBlcnJvci5jYXVzZS5jb2RlID09PSAnRVRJTUVET1VUJyA/IGNyZWF0ZUVycm9yKDUwNCkgOiBlcnJvcikpXG4gIH1cbn1cbiJdfQ==