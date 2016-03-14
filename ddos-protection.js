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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
var singleton = void 0;
var clearance = void 0;

/**
 * Contains simple DoS (Denial of Service) protection.
 * @next: If possible add more complex DDoS (Distributed Denial of Service) protection.
 *
 * @class
 */

var DDoSProtection = function () {
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
}();

// exports


exports.default = DDoSProtection;
exports.DDoSProtection = DDoSProtection;