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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9odHRwLXJlcXVlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFXUyxXQUFXOzs7Ozs7O0FBTTlCLFdBTm1CLFdBQVcsQ0FNakIsSUFBSSxFQUFFOzBCQU5BLFdBQVc7O0FBTzVCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0FBQ2hCLFFBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRTtBQUFBLEdBQ3pCOztlQVRrQixXQUFXOzs7Ozs7OzsyQkFnQ3RCO0FBQ04sYUFBTyw4QkFBUSxJQUFJLENBQUMsY0FBYzs7QUFBQyxPQUVoQyxLQUFLLENBQUMsVUFBQSxLQUFLO2VBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsR0FBRywwQkFBWSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7T0FBQSxDQUFDLENBQUE7S0FDOUc7Ozt3QkF6QnFCO0FBQ3BCLFVBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQTs7QUFFYixVQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDakMsWUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO09BQ3JCLE1BQU07QUFDTCxjQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7T0FDL0I7O0FBRUQsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDakIsWUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFBO09BQ25DOztBQUVELGFBQU8sSUFBSSxDQUFBO0tBQ1o7OztTQXpCa0IsV0FBVzs7O2tCQUFYLFdBQVciLCJmaWxlIjoiaHR0cC1yZXF1ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBjcmVhdGVFcnJvciBmcm9tICdodHRwLWVycm9ycydcbmltcG9ydCByZXF1ZXN0IGZyb20gJ3JlcXVlc3QtcHJvbWlzZSdcblxuLyoqXG4gKiBTaW1wbGUgUHJvbWlzZSBiYXNlZCB3cmFwcGVyIGNsYXNzIGZvciB0aGUgXCJyZXF1ZXN0XCIgcGFja2FnZS5cbiAqIEFsc28gY29udmVydHMgdGltZW91dCBlcnJvcnMgaW50byA1MDQgR2F0ZXdheSBUaW1lb3V0LlxuICpcbiAqIEBjbGFzc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdHRwUmVxdWVzdCB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgSHR0cFJlcXVlc3QgaW5zdGFuY2VcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBvcHRzIE9wdGlvbnMgcGFzc2VkIGRpcmVjdGx5IHRvIHRoZSBcInJlcXVlc3RcIiBtZXRob2QuXG4gICAqL1xuICBjb25zdHJ1Y3RvciAob3B0cykge1xuICAgIHRoaXMub3B0cyA9IG9wdHNcbiAgICB0aGlzLmRlZmF1bHRUaW1lb3V0ID0gNjAgLy8gU2Vuc2libGUgZGVmYXVsdCB2YWx1ZSwgY2FuIGJlIG92ZXJyaWRkZW4gYnkgc2ltcGx5IGV4dGVuZGluZyB0aGlzIGNsYXNzXG4gIH1cblxuICBnZXQgcmVxdWVzdE9wdGlvbnMgKCkge1xuICAgIGxldCBvcHRzID0ge31cblxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRzID09PSAnc3RyaW5nJykge1xuICAgICAgb3B0cy51cmkgPSB0aGlzLm9wdHNcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmFzc2lnbihvcHRzLCB0aGlzLm9wdHMpXG4gICAgfVxuXG4gICAgaWYgKCFvcHRzLnRpbWVvdXQpIHtcbiAgICAgIG9wdHMudGltZW91dCA9IHRoaXMuZGVmYXVsdFRpbWVvdXRcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0c1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIHRoZSByZXF1ZXN0LlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIHNlbmQgKCkge1xuICAgIHJldHVybiByZXF1ZXN0KHRoaXMucmVxdWVzdE9wdGlvbnMpXG4gICAgLy8gVGhyb3cgYSBwcm9wZXIgNTA0IGVycm9yIHdoZW4gdGhlIHJlbW90ZSBiYWNrZW5kIHRpbWVzIG91dFxuICAgICAgLmNhdGNoKGVycm9yID0+IFByb21pc2UucmVqZWN0KGVycm9yLmNhdXNlICYmIGVycm9yLmNhdXNlLmNvZGUgPT09ICdFVElNRURPVVQnID8gY3JlYXRlRXJyb3IoNTA0KSA6IGVycm9yKSlcbiAgfVxufVxuIl19