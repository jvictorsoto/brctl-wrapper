'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBridge = createBridge;
exports.addIfaceToBridge = addIfaceToBridge;
exports.enableBridge = enableBridge;
exports.disableBridge = disableBridge;
exports.deleteBridge = deleteBridge;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _childProcessPromise = require('child-process-promise');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('brctl-wrapper');

// Helper function to exec commands. TODO: Better error handler with custom error class...
function execCmd(cmd) {
  debug('About to execute cmd: ' + cmd);
  return (0, _childProcessPromise.exec)(cmd).then(function (result) {
    debug('Executed cmd: ' + cmd, result);
    var stdout = result.stdout,
        stderr = result.stderr;

    if (stderr.length > 0) {
      return _bluebird2.default.reject({ stdout: stdout, stderr: stderr });
    }
    return stdout;
  }).catch(function (error) {
    debug('Error while executing cmd: ' + cmd, error);
    return _bluebird2.default.reject(error);
  });
}

function createBridge(bridge) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { ifaces: [], enable: false };

  debug('About to create bridge: ' + bridge);
  return execCmd('brctl addbr ' + bridge).then(function () {
    return _bluebird2.default.all(options.ifaces.map(function (iface) {
      return addIfaceToBridge(iface, bridge);
    })).then(function () {
      return options.enable ? enableBridge(bridge) : null;
    });
  });
}

function addIfaceToBridge(iface, bridge) {
  debug('About to add iface: ' + iface + ' to bridge: ' + bridge);
  return execCmd('brctl addif ' + bridge + ' ' + iface).then(function () {
    return null;
  });
}

function enableBridge(bridge) {
  debug('About to enable bridge: ' + bridge);
  return execCmd('ifconfig ' + bridge + ' up').then(function () {
    return null;
  });
}

function disableBridge(bridge) {
  debug('About to disable bridge: ' + bridge);
  return execCmd('ifconfig ' + bridge + ' down').then(function () {
    return null;
  });
}

function deleteBridge(bridge) {
  debug('About to disable & delete bridge: ' + bridge);
  return disableBridge(bridge).then(function () {
    return execCmd('brctl delbr ' + bridge);
  }).then(function () {
    return null;
  });
}