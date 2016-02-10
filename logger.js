'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatter = exports.createLogger = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formatter = function formatter(opts) {
  return '[' + (0, _moment2.default)().format('YYYY-MM-DD HH:mm:ss.SSS') + '] [' + opts.level + '] ' + opts.message;
};

/**
 * Creates a new logger instance
 *
 * @param {Object} cfg Configuration object
 * @param {String} cfg.baseDir Base directory for all logfiles (optional, if file logging is disabled)
 * @param {Object} cfg.destinations Logging destinations config object
 * @param {Object} cfg.destinations.console Configuration object for console/stdout logging
 * @param {Boolean} cfg.destinations.console.enable Enable or disable stdout logging
 * @param {String} cfg.destinations.console.level Log level for stdout logs
 * @param {Array.<{name: String, level: String}>|Boolean} cfg.destinations.files Configuration for file logging - file logging is disabled entirely if this is false
 *
 * @returns {Object}
 */
function createLogger(cfg) {
  if (!cfg) {
    cfg = {};
  }

  var destinations = cfg.destinations || {};

  var logger = new _winston2.default.Logger();

  if (destinations.console && destinations.console.enable) {
    logger.add(_winston2.default.transports.Console, {
      level: destinations.console.level,
      formatter: formatter
    });
  }

  if (destinations.files && Array.isArray(destinations.files)) {
    (function () {
      var baseDir = cfg.baseDir;

      destinations.files.forEach(function (f) {
        var filename = _path2.default.resolve(baseDir, f.name);

        logger.add(_winston2.default.transports.File, {
          filename: filename, formatter: formatter,
          level: f.level,
          name: filename, // winston needs a unique name for each transport
          json: false
        });
      });
    })();
  }

  return logger;
}

exports.default = createLogger;
// Named export for backwards compat reasons

exports.createLogger = createLogger;
exports.formatter = formatter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9sb2dnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNWixJQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBSSxJQUFJO2VBQVMsdUJBQVEsQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsV0FBTSxJQUFJLENBQUMsS0FBSyxVQUFLLElBQUksQ0FBQyxPQUFPO0NBQUU7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEFBZTdHLFNBQVMsWUFBWSxDQUFFLEdBQUcsRUFBRTtBQUMxQixNQUFJLENBQUMsR0FBRyxFQUFFO0FBQ1IsT0FBRyxHQUFHLEVBQUUsQ0FBQTtHQUNUOztBQUVELE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFBOztBQUUzQyxNQUFJLE1BQU0sR0FBRyxJQUFJLGtCQUFRLE1BQU0sRUFBRSxDQUFBOztBQUVqQyxNQUFJLFlBQVksQ0FBQyxPQUFPLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDdkQsVUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBUSxVQUFVLENBQUMsT0FBTyxFQUFFO0FBQ3JDLFdBQUssRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUs7QUFDakMsZUFBUyxFQUFULFNBQVM7S0FDVixDQUFDLENBQUE7R0FDSDs7QUFFRCxNQUFJLFlBQVksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7O0FBQzNELFVBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUE7O0FBRTNCLGtCQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsRUFBSTtBQUM5QixZQUFNLFFBQVEsR0FBRyxlQUFLLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBOztBQUU5QyxjQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFRLFVBQVUsQ0FBQyxJQUFJLEVBQUU7QUFDbEMsa0JBQVEsRUFBUixRQUFRLEVBQUUsU0FBUyxFQUFULFNBQVM7QUFDbkIsZUFBSyxFQUFFLENBQUMsQ0FBQyxLQUFLO0FBQ2QsY0FBSSxFQUFFLFFBQVE7QUFDZCxjQUFJLEVBQUUsS0FBSztTQUNaLENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQTs7R0FDSDs7QUFFRCxTQUFPLE1BQU0sQ0FBQTtDQUNkOztrQkFFYyxZQUFZOzs7UUFFbkIsWUFBWSxHQUFaLFlBQVk7UUFDWixTQUFTLEdBQVQsU0FBUyIsImZpbGUiOiJsb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHdpbnN0b24gZnJvbSAnd2luc3RvbidcblxuY29uc3QgZm9ybWF0dGVyID0gKG9wdHMpID0+IGBbJHttb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTJyl9XSBbJHtvcHRzLmxldmVsfV0gJHtvcHRzLm1lc3NhZ2V9YFxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgbG9nZ2VyIGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNmZyBDb25maWd1cmF0aW9uIG9iamVjdFxuICogQHBhcmFtIHtTdHJpbmd9IGNmZy5iYXNlRGlyIEJhc2UgZGlyZWN0b3J5IGZvciBhbGwgbG9nZmlsZXMgKG9wdGlvbmFsLCBpZiBmaWxlIGxvZ2dpbmcgaXMgZGlzYWJsZWQpXG4gKiBAcGFyYW0ge09iamVjdH0gY2ZnLmRlc3RpbmF0aW9ucyBMb2dnaW5nIGRlc3RpbmF0aW9ucyBjb25maWcgb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gY2ZnLmRlc3RpbmF0aW9ucy5jb25zb2xlIENvbmZpZ3VyYXRpb24gb2JqZWN0IGZvciBjb25zb2xlL3N0ZG91dCBsb2dnaW5nXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNmZy5kZXN0aW5hdGlvbnMuY29uc29sZS5lbmFibGUgRW5hYmxlIG9yIGRpc2FibGUgc3Rkb3V0IGxvZ2dpbmdcbiAqIEBwYXJhbSB7U3RyaW5nfSBjZmcuZGVzdGluYXRpb25zLmNvbnNvbGUubGV2ZWwgTG9nIGxldmVsIGZvciBzdGRvdXQgbG9nc1xuICogQHBhcmFtIHtBcnJheS48e25hbWU6IFN0cmluZywgbGV2ZWw6IFN0cmluZ30+fEJvb2xlYW59IGNmZy5kZXN0aW5hdGlvbnMuZmlsZXMgQ29uZmlndXJhdGlvbiBmb3IgZmlsZSBsb2dnaW5nIC0gZmlsZSBsb2dnaW5nIGlzIGRpc2FibGVkIGVudGlyZWx5IGlmIHRoaXMgaXMgZmFsc2VcbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBjcmVhdGVMb2dnZXIgKGNmZykge1xuICBpZiAoIWNmZykge1xuICAgIGNmZyA9IHt9XG4gIH1cblxuICBjb25zdCBkZXN0aW5hdGlvbnMgPSBjZmcuZGVzdGluYXRpb25zIHx8IHt9XG5cbiAgbGV0IGxvZ2dlciA9IG5ldyB3aW5zdG9uLkxvZ2dlcigpXG5cbiAgaWYgKGRlc3RpbmF0aW9ucy5jb25zb2xlICYmIGRlc3RpbmF0aW9ucy5jb25zb2xlLmVuYWJsZSkge1xuICAgIGxvZ2dlci5hZGQod2luc3Rvbi50cmFuc3BvcnRzLkNvbnNvbGUsIHtcbiAgICAgIGxldmVsOiBkZXN0aW5hdGlvbnMuY29uc29sZS5sZXZlbCxcbiAgICAgIGZvcm1hdHRlclxuICAgIH0pXG4gIH1cblxuICBpZiAoZGVzdGluYXRpb25zLmZpbGVzICYmIEFycmF5LmlzQXJyYXkoZGVzdGluYXRpb25zLmZpbGVzKSkge1xuICAgIGNvbnN0IGJhc2VEaXIgPSBjZmcuYmFzZURpclxuXG4gICAgZGVzdGluYXRpb25zLmZpbGVzLmZvckVhY2goZiA9PiB7XG4gICAgICBjb25zdCBmaWxlbmFtZSA9IHBhdGgucmVzb2x2ZShiYXNlRGlyLCBmLm5hbWUpXG5cbiAgICAgIGxvZ2dlci5hZGQod2luc3Rvbi50cmFuc3BvcnRzLkZpbGUsIHtcbiAgICAgICAgZmlsZW5hbWUsIGZvcm1hdHRlcixcbiAgICAgICAgbGV2ZWw6IGYubGV2ZWwsXG4gICAgICAgIG5hbWU6IGZpbGVuYW1lLCAvLyB3aW5zdG9uIG5lZWRzIGEgdW5pcXVlIG5hbWUgZm9yIGVhY2ggdHJhbnNwb3J0XG4gICAgICAgIGpzb246IGZhbHNlXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gbG9nZ2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUxvZ2dlclxuLy8gTmFtZWQgZXhwb3J0IGZvciBiYWNrd2FyZHMgY29tcGF0IHJlYXNvbnNcbmV4cG9ydCB7Y3JlYXRlTG9nZ2VyfVxuZXhwb3J0IHtmb3JtYXR0ZXJ9XG4iXX0=