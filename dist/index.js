'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _childProcessEs6Promise = require('child-process-es6-promise');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('brctl-wrapper');

// Helper function to exec commands. TODO: Better error handler with custom error class...
function execCmd(cmd) {
  debug('About to execute cmd: ' + cmd);
  return (0, _childProcessEs6Promise.exec)(cmd).then(function (result) {
    debug('Executed cmd: ' + cmd, result);
    var stdout = result.stdout,
        stderr = result.stderr;

    if (stderr && stderr.length > 0) {
      return _bluebird2.default.reject({ stdout: stdout, stderr: stderr });
    }
    return stdout;
  }).catch(function (error) {
    debug('Error while executing cmd: ' + cmd, error);
    return _bluebird2.default.reject(error);
  });
}

var BrctlWrapper = function () {
  function BrctlWrapper() {
    _classCallCheck(this, BrctlWrapper);
  }

  _createClass(BrctlWrapper, [{
    key: 'createBridge',
    value: function createBridge(bridge) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { ifaces: [], enable: false, ip: null };

      debug('About to create bridge: ' + bridge);
      return execCmd('brctl addbr ' + bridge).then(function () {
        return _bluebird2.default.all(options.ifaces.map(function (iface) {
          return _this.addIfaceToBridge(iface, bridge);
        })).then(function () {
          var promises = [];
          if (options.ip) {
            promises.push(_this.setBridgeIP(bridge, options.ip));
          }
          if (options.enable) {
            promises.push(_this.enableBridge(bridge));
          }
          return _bluebird2.default.all(promises);
        });
      });
    }
  }, {
    key: 'addIfaceToBridge',
    value: function addIfaceToBridge(iface, bridge) {
      // eslint-disable-line class-methods-use-this
      debug('About to add iface: ' + iface + ' to bridge: ' + bridge);
      return execCmd('brctl addif ' + bridge + ' ' + iface).then(function () {
        return null;
      });
    }
  }, {
    key: 'enableBridge',
    value: function enableBridge(bridge) {
      // eslint-disable-line class-methods-use-this
      debug('About to enable bridge: ' + bridge);
      return execCmd('ifconfig ' + bridge + ' up').then(function () {
        return null;
      });
    }
  }, {
    key: 'setBridgeIP',
    value: function setBridgeIP(bridge, ip) {
      // eslint-disable-line class-methods-use-this
      debug('About to change bridge ' + bridge + ' IP to: ' + ip);
      return execCmd('ip addr add dev ' + bridge + ' ' + ip).then(function () {
        return null;
      });
    }
  }, {
    key: 'disableBridge',
    value: function disableBridge(bridge) {
      // eslint-disable-line class-methods-use-this
      debug('About to disable bridge: ' + bridge);
      return execCmd('ifconfig ' + bridge + ' down').then(function () {
        return null;
      });
    }
  }, {
    key: 'deleteBridge',
    value: function deleteBridge(bridge) {
      debug('About to disable & delete bridge: ' + bridge);
      return this.disableBridge(bridge).then(function () {
        return execCmd('brctl delbr ' + bridge);
      }).then(function () {
        return null;
      });
    }
  }]);

  return BrctlWrapper;
}();

exports.default = new BrctlWrapper();