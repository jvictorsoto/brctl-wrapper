# brctl-wrapper

Simple wrapper for brctl of Linux (virtual bridges).

## Installation

This module is installed via npm:

```
npm install --save brctl-wrapper
```

## Usage

### Create bridge: Step by step

``` js
import brtcl from 'brtcl-wrapper';

brctl.createBridge('myBridge')
  .then(() => {
    Promise.all(['eth0', 'eth1'].map(i => brctl.addIfaceToBridge(i, 'miBridge')))
      .then(() => {
        brctl.enableBridge('miBridge')
          .then(() => {
            // ----- Bridge is up!
          })
          .catch(err => console.error('Impossible to enable bridge: ', err));
      })
      .catch(err => console.error('Error adding ifaces to bridge: ', err));
  })
  .catch(err => console.error('Error creating bridge: ', err));

```

### Create bridge: Complete setup

``` js
import brtcl from 'brtcl-wrapper';

const bridgeOptions = {
  ifaces: ['eth0', 'eth1'],
  enable: true
};
brctl.createBridge('myBridge', bridgeOptions)
  .then(() => {
    // ----- Bridge is up!
  })
  .catch(err => console.error('Error creating bridge: ', err));

```

### Set a custom ip to the bridge

``` js
import brtcl from 'brtcl-wrapper';

const bridgeOptions = {
  ifaces: ['eth0', 'eth1'],
  enable: true,
  ip: '10.255.1.22/24'
};
brctl.createBridge('myBridge', bridgeOptions)
  .then(() => {
    // ----- Bridge is up and with ip 10.255.1.22/24!
  })
  .catch(err => console.error('Error creating bridge: ', err));

```

### Delete bridge

``` js
import brtcl from 'brtcl-wrapper';

brctl.deleteBridge('myBridge')
  .then(() => {
    // ----- Bridge is disabled and destroyed!
  })
  .catch(err => console.error('Error destroying bridge: ', err));

```


## Enable debug of module

This module uses [debug](https://www.npmjs.com/package/debug) for debugging, you can enable debug messages with:

```
DEBUG=brctl-wrapper
```

## Run tests

```
npm test
```

## License (MIT)

In case you never heard about the [MIT license](http://en.wikipedia.org/wiki/MIT_license).

See the [LICENSE file](LICENSE) for details.