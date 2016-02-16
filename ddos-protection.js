/**
 * Created on 02/15/2016
 *
 * @author: Stephan Schmid (DablS)
 * @copyright DablS 2015+
 */

'use strict';

// imports

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DDoSProtection = undefined;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// defaults
var defaultOpts = {
  maxCounts: 20,
  maxInterval: 120,
  burstPoint: 6,
  raiseMultiplier: 2,
  cleanUpInterval: 10 * 60 * 60
};
var defaultMsgs = {
  dos: { code: 429, msg: 'detected-as-dos' }
};

// privates
var mapDoS = new Map();
var singleton = undefined;
var clearance = undefined;

/**
 * Contains simple DoS (Denial of Service) protection.
 * @next: If possible add more complex DDoS (Distributed Denial of Service) protection.
 *
 * @class
 */

var DDoSProtection = (function () {
  function DDoSProtection() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var msgs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, DDoSProtection);

    this._opts = Object.assign({}, defaultOpts, opts);
    this._msgs = Object.assign({}, defaultMsgs, msgs);

    this.startClearance();
  }

  _createClass(DDoSProtection, [{
    key: 'handleDoS',

    /**
     * Handle simple DoS protection
     * @param unique
     */
    value: function handleDoS(unique) {
      var data = null;
      if (mapDoS.has(unique)) {
        data = mapDoS.get(unique);
        if (data.at < (0, _moment2.default)().utc().subtract(data.interval, 'seconds')) {
          mapDoS.delete(unique);
          data = null;
        }
      }
      data = data || { count: 0, interval: 1, at: (0, _moment2.default)().utc() };
      data.count++;

      if (data.count > this._opts.maxCounts) {
        throw new _httpErrors2.default(this._msgs.dos.code, this._msgs.dos.msg);
      } else {
        if (data.count > this._opts.burstPoint && data.interval < this._opts.maxInterval) {
          data.interval = Math.min(Math.round(data.interval * this._opts.raiseMultiplier), this._opts.maxInterval);
        }
      }

      mapDoS.set(unique, data);
    }
  }, {
    key: 'clearance',

    /**
     * Interval clearance process over all maps
     */
    value: function clearance() {
      mapDoS.forEach(function (val, key, map) {
        if (val.at < (0, _moment2.default)().utc().subtract(val.interval, 'seconds')) {
          map.delete(key);
        }
      });
    }
  }, {
    key: 'startClearance',
    value: function startClearance() {
      clearance = clearance || setInterval(this.clearance, this._opts.cleanUpInterval * 1000);
    }
  }, {
    key: 'stopClearance',
    value: function stopClearance() {
      if (clearance) {
        clearInterval(clearance);
      }
    }
  }, {
    key: 'options',
    get: function get() {
      return this._opts || null;
    }
  }, {
    key: 'messages',
    get: function get() {
      return this._msgs || null;
    }

    /**
     * Simple create singleton
     * @param opts
     * @param msgs
     * @returns {*|DDoSProtection}
     */

  }], [{
    key: 'getInstance',
    value: function getInstance() {
      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var msgs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return singleton = singleton || new DDoSProtection(opts, msgs);
    }
  }, {
    key: 'expressDoS',
    value: function expressDoS(req, res, next) {
      DDoSProtection.getInstance().handleDoS(req.uniqueDoS || (req.headers['x-forwarded-for'] || req.connection.remoteAddress) + '#' + req.headers['user-agent']);
      next();
    }
  }, {
    key: 'koaDoS',
    value: regeneratorRuntime.mark(function koaDoS(next) {
      return regeneratorRuntime.wrap(function koaDoS$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              DDoSProtection.getInstance().handleDoS(this.uniqueDoS || this.request.ip + '#' + this.request.headers['user-agent']);
              _context.next = 3;
              return next;

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, koaDoS, this);
    })
  }, {
    key: 'koa2DoS',
    value: function koa2DoS(ctx, next) {
      return regeneratorRuntime.async(function koa2DoS$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              DDoSProtection.getInstance().handleDoS(ctx.uniqueDoS || ctx.request.ip + '#' + ctx.request.headers['user-agent']);
              _context2.next = 3;
              return regeneratorRuntime.awrap(next());

            case 3:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }]);

  return DDoSProtection;
})();

// exports

exports.default = DDoSProtection;
exports.DDoSProtection = DDoSProtection;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9kZG9zLXByb3RlY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQU9BLFlBQVk7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPWixJQUFNLFdBQVcsR0FBRztBQUNsQixXQUFTLEVBQUUsRUFBRTtBQUNiLGFBQVcsRUFBRSxHQUFHO0FBQ2hCLFlBQVUsRUFBRSxDQUFDO0FBQ2IsaUJBQWUsRUFBRSxDQUFDO0FBQ2xCLGlCQUFlLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO0NBQzlCLENBQUE7QUFDRCxJQUFNLFdBQVcsR0FBRztBQUNsQixLQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxpQkFBaUIsRUFBRTtDQUMzQzs7O0FBQUEsQUFHRCxJQUFJLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3RCLElBQUksU0FBUyxZQUFBLENBQUE7QUFDYixJQUFJLFNBQVMsWUFBQTs7Ozs7Ozs7QUFBQTtJQVFQLGNBQWM7QUFDbEIsV0FESSxjQUFjLEdBQ2lCO1FBQXRCLElBQUkseURBQUcsRUFBRTtRQUFFLElBQUkseURBQUcsRUFBRTs7MEJBRDdCLGNBQWM7O0FBRWhCLFFBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ2pELFFBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFBOztBQUVqRCxRQUFJLENBQUMsY0FBYyxFQUFFLENBQUE7R0FDdEI7O2VBTkcsY0FBYzs7Ozs7Ozs4QkE4QlAsTUFBTSxFQUFFO0FBQ2pCLFVBQUksSUFBSSxHQUFHLElBQUksQ0FBQTtBQUNmLFVBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUN0QixZQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FB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QyxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBRSxZQUFZLENBQUUsQUFBRSxDQUFDLENBQUE7O3FCQUNoSCxJQUFJOzs7Ozs7Ozs7Ozs0QkFHVSxHQUFHLEVBQUUsSUFBSTs7Ozs7QUFDN0IsNEJBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBSSxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBRSxZQUFZLENBQUUsQUFBRSxDQUFDLENBQUE7OzhDQUM3RyxJQUFJLEVBQUU7Ozs7Ozs7Ozs7O1NBakVWLGNBQWM7Ozs7O2tCQTJGTCxjQUFjO1FBQ3JCLGNBQWMsR0FBZCxjQUFjIiwiZmlsZSI6ImRkb3MtcHJvdGVjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBvbiAwMi8xNS8yMDE2XG4gKlxuICogQGF1dGhvcjogU3RlcGhhbiBTY2htaWQgKERhYmxTKVxuICogQGNvcHlyaWdodCBEYWJsUyAyMDE1K1xuICovXG5cbid1c2Ugc3RyaWN0J1xuXG4vLyBpbXBvcnRzXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCdcbmltcG9ydCBIdHRwRXJyb3JzIGZyb20gJ2h0dHAtZXJyb3JzJ1xuXG4vLyBkZWZhdWx0c1xuY29uc3QgZGVmYXVsdE9wdHMgPSB7XG4gIG1heENvdW50czogMjAsXG4gIG1heEludGVydmFsOiAxMjAsXG4gIGJ1cnN0UG9pbnQ6IDYsXG4gIHJhaXNlTXVsdGlwbGllcjogMixcbiAgY2xlYW5VcEludGVydmFsOiAxMCAqIDYwICogNjBcbn1cbmNvbnN0IGRlZmF1bHRNc2dzID0ge1xuICBkb3M6IHsgY29kZTogNDI5LCBtc2c6ICdkZXRlY3RlZC1hcy1kb3MnIH1cbn1cblxuLy8gcHJpdmF0ZXNcbmxldCBtYXBEb1MgPSBuZXcgTWFwKClcbmxldCBzaW5nbGV0b25cbmxldCBjbGVhcmFuY2VcblxuLyoqXG4gKiBDb250YWlucyBzaW1wbGUgRG9TIChEZW5pYWwgb2YgU2VydmljZSkgcHJvdGVjdGlvbi5cbiAqIEBuZXh0OiBJZiBwb3NzaWJsZSBhZGQgbW9yZSBjb21wbGV4IEREb1MgKERpc3RyaWJ1dGVkIERlbmlhbCBvZiBTZXJ2aWNlKSBwcm90ZWN0aW9uLlxuICpcbiAqIEBjbGFzc1xuICovXG5jbGFzcyBERG9TUHJvdGVjdGlvbiB7XG4gIGNvbnN0cnVjdG9yIChvcHRzID0ge30sIG1zZ3MgPSB7fSkge1xuICAgIHRoaXMuX29wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0cywgb3B0cylcbiAgICB0aGlzLl9tc2dzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE1zZ3MsIG1zZ3MpXG5cbiAgICB0aGlzLnN0YXJ0Q2xlYXJhbmNlKClcbiAgfVxuXG4gIGdldCBvcHRpb25zICgpIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0cyB8fCBudWxsXG4gIH1cblxuICBnZXQgbWVzc2FnZXMgKCkge1xuICAgIHJldHVybiB0aGlzLl9tc2dzIHx8IG51bGxcbiAgfVxuXG4gIC8qKlxuICAgKiBTaW1wbGUgY3JlYXRlIHNpbmdsZXRvblxuICAgKiBAcGFyYW0gb3B0c1xuICAgKiBAcGFyYW0gbXNnc1xuICAgKiBAcmV0dXJucyB7KnxERG9TUHJvdGVjdGlvbn1cbiAgICovXG4gIHN0YXRpYyBnZXRJbnN0YW5jZSAob3B0cyA9IHt9LCBtc2dzID0ge30pIHtcbiAgICByZXR1cm4gc2luZ2xldG9uID0gc2luZ2xldG9uIHx8IG5ldyBERG9TUHJvdGVjdGlvbihvcHRzLCBtc2dzKVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBzaW1wbGUgRG9TIHByb3RlY3Rpb25cbiAgICogQHBhcmFtIHVuaXF1ZVxuICAgKi9cbiAgaGFuZGxlRG9TICh1bmlxdWUpIHtcbiAgICBsZXQgZGF0YSA9IG51bGxcbiAgICBpZiAobWFwRG9TLmhhcyh1bmlxdWUpKSB7XG4gICAgICBkYXRhID0gbWFwRG9TLmdldCh1bmlxdWUpXG4gICAgICBpZiAoZGF0YS5hdCA8IG1vbWVudCgpLnV0YygpLnN1YnRyYWN0KGRhdGEuaW50ZXJ2YWwsICdzZWNvbmRzJykpIHtcbiAgICAgICAgbWFwRG9TLmRlbGV0ZSh1bmlxdWUpXG4gICAgICAgIGRhdGEgPSBudWxsXG4gICAgICB9XG4gICAgfVxuICAgIGRhdGEgPSBkYXRhIHx8IHsgY291bnQ6IDAsIGludGVydmFsOiAxLCBhdDogbW9tZW50KCkudXRjKCkgfVxuICAgIGRhdGEuY291bnQrK1xuXG4gICAgaWYgKGRhdGEuY291bnQgPiB0aGlzLl9vcHRzLm1heENvdW50cykge1xuICAgICAgdGhyb3cgbmV3IEh0dHBFcnJvcnModGhpcy5fbXNncy5kb3MuY29kZSwgdGhpcy5fbXNncy5kb3MubXNnKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZGF0YS5jb3VudCA+IHRoaXMuX29wdHMuYnVyc3RQb2ludCAmJiBkYXRhLmludGVydmFsIDwgdGhpcy5fb3B0cy5tYXhJbnRlcnZhbCkge1xuICAgICAgICBkYXRhLmludGVydmFsID0gTWF0aC5taW4oTWF0aC5yb3VuZChkYXRhLmludGVydmFsICogdGhpcy5fb3B0cy5yYWlzZU11bHRpcGxpZXIpLCB0aGlzLl9vcHRzLm1heEludGVydmFsKVxuICAgICAgfVxuICAgIH1cblxuICAgIG1hcERvUy5zZXQodW5pcXVlLCBkYXRhKVxuICB9XG5cbiAgc3RhdGljIGV4cHJlc3NEb1MgKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgRERvU1Byb3RlY3Rpb24uZ2V0SW5zdGFuY2UoKS5oYW5kbGVEb1MocmVxLnVuaXF1ZURvUyB8fCBgJHtyZXEuaGVhZGVyc1sgJ3gtZm9yd2FyZGVkLWZvcicgXSB8fCByZXEuY29ubmVjdGlvbi5yZW1vdGVBZGRyZXNzfSMke3JlcS5oZWFkZXJzWyAndXNlci1hZ2VudCcgXX1gKVxuICAgIG5leHQoKVxuICB9XG5cbiAgc3RhdGljICprb2FEb1MgKG5leHQpIHtcbiAgICBERG9TUHJvdGVjdGlvbi5nZXRJbnN0YW5jZSgpLmhhbmRsZURvUyh0aGlzLnVuaXF1ZURvUyB8fCBgJHt0aGlzLnJlcXVlc3QuaXB9IyR7dGhpcy5yZXF1ZXN0LmhlYWRlcnNbICd1c2VyLWFnZW50JyBdfWApXG4gICAgeWllbGQgbmV4dFxuICB9XG5cbiAgc3RhdGljIGFzeW5jIGtvYTJEb1MgKGN0eCwgbmV4dCkge1xuICAgIEREb1NQcm90ZWN0aW9uLmdldEluc3RhbmNlKCkuaGFuZGxlRG9TKGN0eC51bmlxdWVEb1MgfHwgYCR7Y3R4LnJlcXVlc3QuaXB9IyR7Y3R4LnJlcXVlc3QuaGVhZGVyc1sgJ3VzZXItYWdlbnQnIF19YClcbiAgICBhd2FpdCBuZXh0KClcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcnZhbCBjbGVhcmFuY2UgcHJvY2VzcyBvdmVyIGFsbCBtYXBzXG4gICAqL1xuICBjbGVhcmFuY2UgKCkge1xuICAgIG1hcERvUy5mb3JFYWNoKCh2YWwsIGtleSwgbWFwKSA9PiB7XG4gICAgICBpZiAodmFsLmF0IDwgbW9tZW50KCkudXRjKCkuc3VidHJhY3QodmFsLmludGVydmFsLCAnc2Vjb25kcycpKSB7XG4gICAgICAgIG1hcC5kZWxldGUoa2V5KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBzdGFydENsZWFyYW5jZSAoKSB7XG4gICAgY2xlYXJhbmNlID0gY2xlYXJhbmNlIHx8IHNldEludGVydmFsKHRoaXMuY2xlYXJhbmNlLCB0aGlzLl9vcHRzLmNsZWFuVXBJbnRlcnZhbCAqIDEwMDApXG4gIH1cblxuICBzdG9wQ2xlYXJhbmNlICgpIHtcbiAgICBpZiAoY2xlYXJhbmNlKSB7XG4gICAgICBjbGVhckludGVydmFsKGNsZWFyYW5jZSlcbiAgICB9XG4gIH1cbn1cblxuLy8gZXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgRERvU1Byb3RlY3Rpb25cbmV4cG9ydCB7RERvU1Byb3RlY3Rpb259Il19