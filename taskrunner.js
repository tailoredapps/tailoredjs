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
    var logLevel = arguments.length <= 4 || arguments[4] === undefined ? 'info' : arguments[4];

    _classCallCheck(this, Taskrunner);

    this.task = task;
    this.interval = interval;
    this.friendlyName = friendlyName;

    this.logger = logger;
    this.runCount = 0;
    this.outputLog = logger && logLevel ? this.logger[logLevel].bind(this.logger) : function () {};

    this.outputLog('++++ Registering new periodic task "%s", running every %s sec.', this.friendlyName, this.interval);
  }

  _createClass(Taskrunner, [{
    key: 'run',
    value: function run() {
      var hadError;
      return regeneratorRuntime.async(function run$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!taskRunning) {
                _context.next = 4;
                break;
              }

              this.outputLog('---- Queuing task "%s", task "%s" currently running.', this.friendlyName, taskRunning.friendlyName);

              queue.add(this);
              return _context.abrupt('return');

            case 4:

              taskRunning = this;

              this.runCount++;
              this._startTime = new Date();

              this.outputLog('>>>> Running periodic task "%s". Run number %s.', this.friendlyName, this.runCount);

              hadError = false;
              _context.prev = 9;
              _context.next = 12;
              return regeneratorRuntime.awrap(this.task());

            case 12:
              _context.next = 19;
              break;

            case 14:
              _context.prev = 14;
              _context.t0 = _context['catch'](9);

              this.logger.error('Error while running periodic task "%s": %s.', this.friendlyName, _context.t0.message);
              this.logger.debug(_context.t0.stack);

              hadError = true;

            case 19:

              this.scheduleNextRun(hadError ? 5 : null, hadError);

            case 20:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this, [[9, 14]]);
    }
  }, {
    key: 'scheduleNextRun',
    value: function scheduleNextRun() {
      var overrideTimeout = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var hadError = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var now = new Date();
      var elapsed = (0, _util.getDuration)(this._startTime, now);
      var timeout = overrideTimeout || this.interval;

      this.outputLog('>>>> Periodic task "%s" run #%s %s (took %s sec). Running again in %s sec.', this.friendlyName, this.runCount, hadError ? 'aborted' : 'completed', elapsed, timeout);

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
    value: function saveStats(stats) {}
  }]);

  return Taskrunner;
}();

exports.default = Taskrunner;