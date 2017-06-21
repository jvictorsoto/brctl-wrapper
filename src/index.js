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

class BrctlWrapper {
  createBridge(bridge, options = { ifaces: [], enable: false, ip: null }) {
    debug(`About to create bridge: ${bridge}`);
    return execCmd(`brctl addbr ${bridge}`)
      .then(() => Promise.all(options.ifaces.map(iface => this.addIfaceToBridge(iface, bridge)))
        .then(() => {
          const promises = [];
          if (options.ip) { promises.push(this.setBridgeIP(bridge, options.ip)); }
          if (options.enable) { promises.push(this.enableBridge(bridge)); }
          return Promise.all(promises);
        }));
  }

  addIfaceToBridge(iface, bridge) { // eslint-disable-line class-methods-use-this
    debug(`About to add iface: ${iface} to bridge: ${bridge}`);
    return execCmd(`brctl addif ${bridge} ${iface}`).then(() => null);
  }

  enableBridge(bridge) { // eslint-disable-line class-methods-use-this
    debug(`About to enable bridge: ${bridge}`);
    return execCmd(`ifconfig ${bridge} up`).then(() => null);
  }

  setBridgeIP(bridge, ip) { // eslint-disable-line class-methods-use-this
    debug(`About to change bridge ${bridge} IP to: ${ip}`);
    return execCmd(`ip addr add dev ${bridge} ${ip}`).then(() => null);
  }

  disableBridge(bridge) { // eslint-disable-line class-methods-use-this
    debug(`About to disable bridge: ${bridge}`);
    return execCmd(`ifconfig ${bridge} down`).then(() => null);
  }

  deleteBridge(bridge) {
    debug(`About to disable & delete bridge: ${bridge}`);
    return this.disableBridge(bridge)
      .then(() => execCmd(`brctl delbr ${bridge}`)).then(() => null);
  }
}

export default new BrctlWrapper();
