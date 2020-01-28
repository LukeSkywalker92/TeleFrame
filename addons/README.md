# TeleFrame addon interface

The addon interface is provided for easy implementation of extensions without having to deal with too many internas of the TeleFrame code.

A useful addon would be for example to switch an LED when new images arrive or display a notifications on the TeleFrame screen.


## Contents

- [How does it work](#how-does-it-work)

- [API](#api)

- [Configure addons]()
- [Addon examples](#Addon-examples)

  The provided example addons should demonstrate how the addon interface works. They should show what is possible and to illustrate the process. The examples are not useful in normal operation.

  - [Event monitoring example](#event-monitoring-example)
  - [Auto control example](#autoplay-example)

- [Installing existing addons](#installing-existing-addons)



## How does it work

An addon can register and listen to events from TeleFrame - for example `newIndex`, `imageDeleted`, and counting and execute its own code in the context of the TeleFrame main process and also send input events like `prev`, `next` to the renderer process.

### How TeleFrame addons loads

At the start of TeleFrame addons are loaded like `node modules` using `require('addons/<addonFolder>')`.

Therefore it is required that an addon provide an `addons/<addonFolder>/index.js` to be able to load.

Addon can have their own GIT repo and also a `packages.json` to install additional needed node packages without affecting the TeleFrame installation.

## API

To create an addon a *function* or *class interface* is available. Whichever you prefer.

An addon *function* gets a preconfigured interface object to access the required methods and properties, which can be used.

A _class_ derived from `AddonBase` itself has the required methods and properties.

Below you will find skeletons that can be used as starting point for programming your addons `addon/<myAddon>/index.js`.




### Skeleton for the **function interface**
<details>
<summary>click to show the code</summary>

```js
/**
 * Listen to all available events and output to the logger
 * @param  {AddonBase inherited} interface   object to register and send events
 */
const MayExampleAddonFunction = (interface) => {

  // register event listeners to something awesome
  //interface.registerListener('newImage', () => interface.logger.warn('New image arrived.'));
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== 'undefined') {
  module.exports = MayExampleAddonFunction;
}
```
</details>


### Skeleton for the **class interface**
<details>
<summary>click to show the code</summary>

```js
const {AddonBase} = require(`${__dirname}/../../js/addonInterface`);

class MyExampleAddonClass  extends AddonBase {
  constructor(config) {
    super(config);

    // register event listeners to something awesome
    //this.registerListener('newImage', () => this.logger.warn('New image arrived.'));
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== 'undefined') {
  module.exports = MyExampleAddonClass;
}
```
</details>


## Addon examples

The examples are available in both class and function versions.
**Please use only the class or function version at the same time, otherwise you will go crazy with all the log entries:-)**

To try an addon, copy the example addon folder from `examples` one level up to `addons`. See [Example walkthrough](###-Walkthrough-to-install-an-addon-example).

### Event monitoring example

This addon listens for all available events and logs them.

- Function example:
[`addons/examples/functionExampleMonitor`](addons/examples/functionExampleMonitor/index.js)

- class example:
[`addons/examples/classExampleMonitor`](addons/examples/classExampleMonitor/index.js)


### Event monitoring example

This addon listens for all available events and logs them.

- Function example:
[`addons/examples/functionExampleMonitor`](addons/examples/functionExampleAutoControl/index.js)

- class example:
[`addons/examples/classExampleMonitor`](addons/examples/classExampleAutoControl/index.js)


#### Walkthrough to install an addon example

```sh
cd ~/TeleFrame
cp -R addons/examples/functionExampleMonitor addons/functionExampleMonitor
./tools/addon_control.sh enable functionExampleMonitor
```

## Installing existing addons


Create a new folder under `TeleFrame/addon`.
