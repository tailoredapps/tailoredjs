'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var taskRunning = false;
var queue = new Set();

var Taskrunner = function () {
  function Taskrunner(task, interval, logger) {
    var friendlyName = arguments.length <= 3 || arguments[3] === undefined ? 'PeriodicTask' : arguments[3];

    _classCallCheck(this, Taskrunner);

    this.task = task;
    this.interval = interval;
    this.friendlyName = friendlyName;

    this.logger = logger;
    this.runCount = 0;

    this.logger.info('++++ Registering new periodic task "%s", running every %s sec.', this.friendlyName, this.interval);
  }

  _createClass(Taskrunner, [{
    key: 'run',
    value: function run() {
      var logger, hadError;
      return regeneratorRuntime.async(function run$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              logger = this.logger;

              if (!taskRunning) {
                _context.next = 5;
                break;
              }

              logger.info('---- Queuing task "%s", task "%s" currently running.', this.friendlyName, taskRunning.friendlyName);

              queue.add(this);
              return _context.abrupt('return');

            case 5:

              taskRunning = this;

              this.runCount++;
              this._startTime = new Date();

              logger.info('>>>> Running periodic task "%s". Run number %s.', this.friendlyName, this.runCount);

              hadError = false;
              _context.prev = 10;
              _context.next = 13;
              return regeneratorRuntime.awrap(this.task());

            case 13:
              _context.next = 20;
              break;

            case 15:
              _context.prev = 15;
              _context.t0 = _context['catch'](10);

              logger.error('Error while running periodic task "%s": %s.', this.friendlyName, _context.t0.message);
              logger.debug(_context.t0.stack);

              hadError = true;

            case 20:

              this.scheduleNextRun(hadError ? 5 : null, hadError);

            case 21:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this, [[10, 15]]);
    }
  }, {
    key: 'scheduleNextRun',
    value: function scheduleNextRun() {
      var overrideTimeout = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var hadError = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var now = new Date();
      var elapsed = (0, _util.getDuration)(this._startTime, now);
      var timeout = overrideTimeout || this.interval;

      this.logger.info('>>>> Periodic task "%s" run #%s %s (took %s sec). Running again in %s sec.', this.friendlyName, this.runCount, hadError ? 'aborted' : 'completed', elapsed, timeout);

      setTimeout(this.run.bind(this), timeout * 1000);

      taskRunning = null;

      if (queue.size > 0) {
        var queuedTask = [].concat(_toConsumableArray(queue)).shift();

        queuedTask.run();
        queue.delete(queuedTask);
      }

      this.saveStats({
        error: hadError,
        task: this.friendlyName,
        start: this._startTime,
        end: now,
        elapsed: elapsed
      });
    }
  }, {
    key: 'saveStats',
    value: function saveStats(stats) {
      this.logger.debug('"saveStats" method not implemented in class %s.', this.constructor.name);
    }
  }]);

  return Taskrunner;
}();

exports.default = Taskrunner;