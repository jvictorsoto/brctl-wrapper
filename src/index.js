import Promise from 'bluebird';
import { exec } from 'child-process-promise';

const debug = require('debug')('brctl-wrapper');

// Helper function to exec commands. TODO: Better error handler with custom error class...
function execCmd(cmd) {
  debug(`About to execute cmd: ${cmd}`);
  return exec(cmd)
    .then((result) => {
      debug(`Executed cmd: ${cmd}`, result);
      const { stdout, stderr } = result;
      if (stderr.length > 0) {
        return Promise.reject({ stdout, stderr });
      }
      return stdout;
    })
    .catch((error) => {
      debug(`Error while executing cmd: ${cmd}`, error);
      return Promise.reject(error);
    });
}

export function createBridge(bridge, options = { ifaces: [], enable: false }) {
  debug(`About to create bridge: ${bridge}`);
  return execCmd(`brctl addbr ${bridge}`)
    .then(() => Promise.all(options.ifaces.map(iface => addIfaceToBridge(iface, bridge)))
      .then(() => options.enable ? enableBridge(bridge) : null));
}

export function addIfaceToBridge(iface, bridge) {
  debug(`About to add iface: ${iface} to bridge: ${bridge}`);
  return execCmd(`brctl addif ${bridge} ${iface}`).then(() => null);
}

export function enableBridge(bridge) {
  debug(`About to enable bridge: ${bridge}`);
  return execCmd(`ifconfig ${bridge} up`).then(() => null);
}

export function disableBridge(iface, bridge) {
  debug(`About to disable bridge: ${bridge}`);
  return execCmd(`ifconfig ${bridge} down`).then(() => null);
}

export function deleteBridge(iface, bridge) {
  debug(`About to disable & delete bridge: ${bridge}`);
  return disableBridge(iface, bridge)
    .then(execCmd(`brctl delbr ${bridge}`)).then(() => null);
}
