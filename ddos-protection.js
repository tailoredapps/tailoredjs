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
      DDoSProtection.getInstance().handleDoS(req.uniqueDoS || DDoSProtection.createUnique(req));
      next();
    }
  }, {
    key: 'koaDoS',
    value: regeneratorRuntime.mark(function koaDoS(next) {
      return regeneratorRuntime.wrap(function koaDoS$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              DDoSProtection.getInstance().handleDoS(this.uniqueDoS || DDoSProtection.createUnique(this.request));
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
              DDoSProtection.getInstance().handleDoS(ctx.uniqueDoS || DDoSProtection.createUnique(ctx.request));
              _context2.next = 3;
              return regeneratorRuntime.awrap(next());

            case 3:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this);
    }

    /**
     * Automatically create an uinique identifier for the current client
     * @param req
     * @returns {*}
     */

  }, {
    key: 'createUnique',
    value: function createUnique(req) {
      return (req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress) + '#' + req.headers['user-agent'];
    }
  }]);

  return DDoSProtection;
})();

// exports

exports.default = DDoSProtection;
exports.DDoSProtection = DDoSProtection;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9kZG9zLXByb3RlY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQU9BLFlBQVk7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPWixJQUFNLFdBQVcsR0FBRztBQUNsQixXQUFTLEVBQUUsRUFBRTtBQUNiLGFBQVcsRUFBRSxHQUFHO0FBQ2hCLFlBQVUsRUFBRSxDQUFDO0FBQ2IsaUJBQWUsRUFBRSxDQUFDO0FBQ2xCLGlCQUFlLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO0NBQzlCLENBQUE7QUFDRCxJQUFNLFdBQVcsR0FBRztBQUNsQixLQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxpQkFBaUIsRUFBRTtDQUMzQzs7O0FBQUEsQUFHRCxJQUFJLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3RCLElBQUksU0FBUyxZQUFBLENBQUE7QUFDYixJQUFJLFNBQVMsWUFBQTs7Ozs7Ozs7QUFBQTtJQVFQLGNBQWM7QUFDbEIsV0FESSxjQUFjLEdBQ2lCO1FBQXRCLElBQUkseURBQUcsRUFBRTtRQUFFLElBQUkseURBQUcsRUFBRTs7MEJBRDdCLGNBQWM7O0FBRWhCLFFBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ2pELFFBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFBOztBQUVqRCxRQUFJLENBQUMsY0FBYyxFQUFFLENBQUE7R0FDdEI7O2VBTkcsY0FBYzs7Ozs7Ozs4QkE4QlAsTUFBTSxFQUFFO0FBQ2pCLFVBQUksSUFBSSxHQUFHLElBQUksQ0FBQTtBQUNmLFVBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUN0QixZQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FB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T0FBTyxDQUFDLENBQUMsQ0FBQTs7cUJBQzdGLElBQUk7Ozs7Ozs7Ozs7OzRCQUdVLEdBQUcsRUFBRSxJQUFJOzs7OztBQUM3Qiw0QkFBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLGNBQWMsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7OzhDQUMzRixJQUFJLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7OztpQ0FRTyxHQUFHLEVBQUU7QUFDeEIsY0FBVSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUUsaUJBQWlCLENBQUUsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQSxTQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUUsWUFBWSxDQUFFLENBQUU7S0FDdEg7OztTQTNFRyxjQUFjOzs7OztrQkFvR0wsY0FBYztRQUNyQixjQUFjLEdBQWQsY0FBYyIsImZpbGUiOiJkZG9zLXByb3RlY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgb24gMDIvMTUvMjAxNlxuICpcbiAqIEBhdXRob3I6IFN0ZXBoYW4gU2NobWlkIChEYWJsUylcbiAqIEBjb3B5cmlnaHQgRGFibFMgMjAxNStcbiAqL1xuXG4ndXNlIHN0cmljdCdcblxuLy8gaW1wb3J0c1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnXG5pbXBvcnQgSHR0cEVycm9ycyBmcm9tICdodHRwLWVycm9ycydcblxuLy8gZGVmYXVsdHNcbmNvbnN0IGRlZmF1bHRPcHRzID0ge1xuICBtYXhDb3VudHM6IDIwLFxuICBtYXhJbnRlcnZhbDogMTIwLFxuICBidXJzdFBvaW50OiA2LFxuICByYWlzZU11bHRpcGxpZXI6IDIsXG4gIGNsZWFuVXBJbnRlcnZhbDogMTAgKiA2MCAqIDYwXG59XG5jb25zdCBkZWZhdWx0TXNncyA9IHtcbiAgZG9zOiB7IGNvZGU6IDQyOSwgbXNnOiAnZGV0ZWN0ZWQtYXMtZG9zJyB9XG59XG5cbi8vIHByaXZhdGVzXG5sZXQgbWFwRG9TID0gbmV3IE1hcCgpXG5sZXQgc2luZ2xldG9uXG5sZXQgY2xlYXJhbmNlXG5cbi8qKlxuICogQ29udGFpbnMgc2ltcGxlIERvUyAoRGVuaWFsIG9mIFNlcnZpY2UpIHByb3RlY3Rpb24uXG4gKiBAbmV4dDogSWYgcG9zc2libGUgYWRkIG1vcmUgY29tcGxleCBERG9TIChEaXN0cmlidXRlZCBEZW5pYWwgb2YgU2VydmljZSkgcHJvdGVjdGlvbi5cbiAqXG4gKiBAY2xhc3NcbiAqL1xuY2xhc3MgRERvU1Byb3RlY3Rpb24ge1xuICBjb25zdHJ1Y3RvciAob3B0cyA9IHt9LCBtc2dzID0ge30pIHtcbiAgICB0aGlzLl9vcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdHMsIG9wdHMpXG4gICAgdGhpcy5fbXNncyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRNc2dzLCBtc2dzKVxuXG4gICAgdGhpcy5zdGFydENsZWFyYW5jZSgpXG4gIH1cblxuICBnZXQgb3B0aW9ucyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wdHMgfHwgbnVsbFxuICB9XG5cbiAgZ2V0IG1lc3NhZ2VzICgpIHtcbiAgICByZXR1cm4gdGhpcy5fbXNncyB8fCBudWxsXG4gIH1cblxuICAvKipcbiAgICogU2ltcGxlIGNyZWF0ZSBzaW5nbGV0b25cbiAgICogQHBhcmFtIG9wdHNcbiAgICogQHBhcmFtIG1zZ3NcbiAgICogQHJldHVybnMgeyp8RERvU1Byb3RlY3Rpb259XG4gICAqL1xuICBzdGF0aWMgZ2V0SW5zdGFuY2UgKG9wdHMgPSB7fSwgbXNncyA9IHt9KSB7XG4gICAgcmV0dXJuIHNpbmdsZXRvbiA9IHNpbmdsZXRvbiB8fCBuZXcgRERvU1Byb3RlY3Rpb24ob3B0cywgbXNncylcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgc2ltcGxlIERvUyBwcm90ZWN0aW9uXG4gICAqIEBwYXJhbSB1bmlxdWVcbiAgICovXG4gIGhhbmRsZURvUyAodW5pcXVlKSB7XG4gICAgbGV0IGRhdGEgPSBudWxsXG4gICAgaWYgKG1hcERvUy5oYXModW5pcXVlKSkge1xuICAgICAgZGF0YSA9IG1hcERvUy5nZXQodW5pcXVlKVxuICAgICAgaWYgKGRhdGEuYXQgPCBtb21lbnQoKS51dGMoKS5zdWJ0cmFjdChkYXRhLmludGVydmFsLCAnc2Vjb25kcycpKSB7XG4gICAgICAgIG1hcERvUy5kZWxldGUodW5pcXVlKVxuICAgICAgICBkYXRhID0gbnVsbFxuICAgICAgfVxuICAgIH1cbiAgICBkYXRhID0gZGF0YSB8fCB7IGNvdW50OiAwLCBpbnRlcnZhbDogMSwgYXQ6IG1vbWVudCgpLnV0YygpIH1cbiAgICBkYXRhLmNvdW50KytcblxuICAgIGlmIChkYXRhLmNvdW50ID4gdGhpcy5fb3B0cy5tYXhDb3VudHMpIHtcbiAgICAgIHRocm93IG5ldyBIdHRwRXJyb3JzKHRoaXMuX21zZ3MuZG9zLmNvZGUsIHRoaXMuX21zZ3MuZG9zLm1zZylcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGRhdGEuY291bnQgPiB0aGlzLl9vcHRzLmJ1cnN0UG9pbnQgJiYgZGF0YS5pbnRlcnZhbCA8IHRoaXMuX29wdHMubWF4SW50ZXJ2YWwpIHtcbiAgICAgICAgZGF0YS5pbnRlcnZhbCA9IE1hdGgubWluKE1hdGgucm91bmQoZGF0YS5pbnRlcnZhbCAqIHRoaXMuX29wdHMucmFpc2VNdWx0aXBsaWVyKSwgdGhpcy5fb3B0cy5tYXhJbnRlcnZhbClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtYXBEb1Muc2V0KHVuaXF1ZSwgZGF0YSlcbiAgfVxuXG4gIHN0YXRpYyBleHByZXNzRG9TIChyZXEsIHJlcywgbmV4dCkge1xuICAgIEREb1NQcm90ZWN0aW9uLmdldEluc3RhbmNlKCkuaGFuZGxlRG9TKHJlcS51bmlxdWVEb1MgfHwgRERvU1Byb3RlY3Rpb24uY3JlYXRlVW5pcXVlKHJlcSkpXG4gICAgbmV4dCgpXG4gIH1cblxuICBzdGF0aWMgKmtvYURvUyAobmV4dCkge1xuICAgIEREb1NQcm90ZWN0aW9uLmdldEluc3RhbmNlKCkuaGFuZGxlRG9TKHRoaXMudW5pcXVlRG9TIHx8IEREb1NQcm90ZWN0aW9uLmNyZWF0ZVVuaXF1ZSh0aGlzLnJlcXVlc3QpKVxuICAgIHlpZWxkIG5leHRcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBrb2EyRG9TIChjdHgsIG5leHQpIHtcbiAgICBERG9TUHJvdGVjdGlvbi5nZXRJbnN0YW5jZSgpLmhhbmRsZURvUyhjdHgudW5pcXVlRG9TIHx8IEREb1NQcm90ZWN0aW9uLmNyZWF0ZVVuaXF1ZShjdHgucmVxdWVzdCkpXG4gICAgYXdhaXQgbmV4dCgpXG4gIH1cblxuICAvKipcbiAgICogQXV0b21hdGljYWxseSBjcmVhdGUgYW4gdWluaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgY3VycmVudCBjbGllbnRcbiAgICogQHBhcmFtIHJlcVxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIHN0YXRpYyBjcmVhdGVVbmlxdWUgKHJlcSkge1xuICAgIHJldHVybiBgJHtyZXEuaXAgfHwgcmVxLmhlYWRlcnNbICd4LWZvcndhcmRlZC1mb3InIF0gfHwgcmVxLmNvbm5lY3Rpb24ucmVtb3RlQWRkcmVzc30jJHtyZXEuaGVhZGVyc1sgJ3VzZXItYWdlbnQnIF19YFxuICB9XG5cbiAgLyoqXG4gICAqIEludGVydmFsIGNsZWFyYW5jZSBwcm9jZXNzIG92ZXIgYWxsIG1hcHNcbiAgICovXG4gIGNsZWFyYW5jZSAoKSB7XG4gICAgbWFwRG9TLmZvckVhY2goKHZhbCwga2V5LCBtYXApID0+IHtcbiAgICAgIGlmICh2YWwuYXQgPCBtb21lbnQoKS51dGMoKS5zdWJ0cmFjdCh2YWwuaW50ZXJ2YWwsICdzZWNvbmRzJykpIHtcbiAgICAgICAgbWFwLmRlbGV0ZShrZXkpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHN0YXJ0Q2xlYXJhbmNlICgpIHtcbiAgICBjbGVhcmFuY2UgPSBjbGVhcmFuY2UgfHwgc2V0SW50ZXJ2YWwodGhpcy5jbGVhcmFuY2UsIHRoaXMuX29wdHMuY2xlYW5VcEludGVydmFsICogMTAwMClcbiAgfVxuXG4gIHN0b3BDbGVhcmFuY2UgKCkge1xuICAgIGlmIChjbGVhcmFuY2UpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwoY2xlYXJhbmNlKVxuICAgIH1cbiAgfVxufVxuXG4vLyBleHBvcnRzXG5leHBvcnQgZGVmYXVsdCBERG9TUHJvdGVjdGlvblxuZXhwb3J0IHtERG9TUHJvdGVjdGlvbn0iXX0=