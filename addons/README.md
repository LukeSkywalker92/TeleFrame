# TeleFrame addon interface

The addon interface is provided for easy implementation of extensions without having to deal with too many internals of the TeleFrame code. For example to control a hardware extension like LED's and buttons or whatever.

If the addon is used, you can listen to events from TeleFrame and execute your own code when the event was fired.
It is also possible to send input commands to control the TeleFrame.

If someone wants to implement more complex scenarios, all required objects of TeleFrame are also available when they are needed.
For example, it would be possible to run TeleFrame without an internet connection and provide an addon that updates the images from a locally available drive.

A useful addon would be for example to switch an LED when new images arrive or display a notifications on the TeleFrame screen. The [newImageLED](#new-image-notification-led) addon is available as an example.
With the [webRemote demo addon](https://github.com/gegu/TeleFrame-webRemote) there is also a more advanced example available, which you can clone. See [Installing existing addons](#installing-existing-addons-from-github).

## Contents

- [How does it work](#how-does-it-work)
- [API](#api)
- [Configure addons](#configure-addons)
- [Addon examples](#addon-examples)
  - **Examples to understand the addon interface**

    The following listed example addons should demonstrate how the addon interface works.
    - [Event monitoring example](#event-monitoring-example)
    - [Auto control example](#auto-control-example)

  - [New image notification LED](#new-image-notification-led), a useful addon

    Example to switch an LED when new images arrive.
- [Installing existing addons](#installing-existing-addons-from-github)

- Wiki: [Available TeleFrame addons](https://github.com/LukeSkywalker92/TeleFrame/wiki/Available-TeleFrame-addons)

## How does it work

An addon can register and listen to events from TeleFrame - for example `newIndex`, `imageDeleted`, and counting and then execute its own code in the context of the TeleFrame main process and also send input events like `prev`, `next` to the renderer process to change te current image.

Addons run within the main process of TeleFrame and communicate with the renderer process via IPC.

### How TeleFrame addons loads

At the start of TeleFrame addons are loaded like `node modules` using `require('addons/<addonFolder>')`.

Therefore it is required that an addon provide an `addons/<addonFolder>/index.js` to be able to load.

Addons can have their own GIT repository and also a `packages.json` to install additional needed node packages without affecting the TeleFrame installation.

## API

To create an addon a *function* or *class interface* is available. Whichever you prefer.

An addon *function* gets a preconfigured interface object to access the required methods and properties, which can be used.

A _class_ derived from `AddonBase` itself has the required methods and properties.

Below you will find skeletons that can be used as starting point for coding your addons `addon/<myAddon>/index.js`.
Skeletons are available to use the **[function interface](#skeleton-for-the-function-interface)** or the **[class interface](#skeleton-for-the-class-interface)**.


### Class AddonBase

The base class from which addons are inherited. If you use the function interface, a preconfigured object of this class is created automatically.

#### Methods

-  **constructor(config)**

   **Arguments**

   | Name                  | Type             | Description                         |
   |-----------------------|------------------|-------------------------------------|
   | `addonConfig`         | {Object}         | configuration object for the addon  |

-  **registerListener(eventName, callbacks)**

   Register listeners for events sent from the TeleFrame renderer

   **Arguments**

   | Name                  | Type             | Description                                                            |
   |-----------------------|------------------|------------------------------------------------------------------------|
   | `eventName`           | {string\|Array}   | name or array of names for the event to listen to                     |
   | `callbacks`           | {Function\|Array} | function/array of functions to execute when the event was fired       |
   | `once`                | {boolean}         | The callbacks are only executed on the first occurrence of the event  |

   **Available listeners that can be registered**
   <details>
   <summary>Click to show/hide the events</summary>

   | Name                  | Description                                                                                 |
   |-----------------------|---------------------------------------------------------------------------------------------|
   | `renderer-ready`      | Renderer was initialized                                                                    |
   | `images-loaded`       | Fired only once when the images object was initialized                                      |
   | `teleFrame-ready`     | Fired only once when TeleFrame has initialized the objects.                                 |
   |                       | *Arguments*: prepared and running TeleFrame objects { config, sceen, imageWatchdog, bot, voiceReply, scheduler}  **CAUTION: If you use these objects, you should really know what you are doing!** |
   | `starImage`           | Request to star an image.                                                                   |
   |                       | *Argument*: currentImageIndex                                                               |
   | `unstarImage`         | Request to unstar an image.                                                                 |
   |                       | *Argument*: currentImageIndex                                                               |
   | `deleteImage`         | Request to delete an image.                                                                 |
   |                       | *Argument*: currentImageIndex                                                               |
   | `imageDeleted`        | Notification that an image has been deleted.                                                |
   |                       | *Argument*: currentImageIndex                                                               |
   | `removeImageUnseen`   | Request to remove the unseen status of all images                                           |
   | `imageUnseenRemoved`  | Notification that the  unseen status of all images has been removed                         |
   | `newImage`            | New image notification                                                                      |
   | `paused`              | Notification that the pause status has changed.                                             |
   |                       | *Argument*: paused true|false                                                               |
   | `muted`               | Notification that the mute status has changed.                                              |
   |                       | *Argument*: paused true|false                                                               |
   | `screenOn`            | Notification that the screenOn status has changed.                                          |
   |                       | *Argument*: screenOn true|false                                                             |
   | `recordStarted`       | Notification that a recording started                                                       |
   | `recordStopped`       | Notification that a recording stopped                                                       |
   | `recordError`         | Notification that a recording failed                                                        |
   | `changingActiveImage` | Notification before changing the current image.                                             |
   |                       | *Argument*: currentImageIndex, fadeTime (ms)                                                |
   | `changedActiveImage`  | Notification that the current image has been changed.                                       |
   |                       | *Argument*: currentImageIndex (ms)                                                          |

   </details>

-  **sendEvent(eventName, ...args)**

   Send an input event to the TeleFrame renderer

   **Arguments**

   | Name              | Type             | Description                                                       |
   |-------------------|------------------|-------------------------------------------------------------------|
   | `eventName`       | {string}         | name of the event to send to the TeleFrame renderer               |
   | `args`            | {Array}          | optional arguments to send                                        |

   **Available Input events that can be sent**
   <details>
   <summary>Click to show/hide the events</summary>

   | Name              | Description                                                       |
   |-------------------|-------------------------------------------------------------------|
   | `next`            | Show the next image/video                                         |
   |                   | *Argument*: optional fadeTime (ms)                                |
   | `previous`        | Show the previous image/video                                     |
   |                   | *Argument*: optional fadeTime (ms)                                |
   | `pause`           | Enter pause mode                                                  |
   | `play`            | Ends  pause mode                                                  |
   | `playPause`       | Toggle play/pause                                                 |
   | `newest`          | Show the newest image and terminate notification                  |
   | `delete`          | Delete an image/video                                             |
   | `star`            | Toggle starring status of an image/video                          |
   | `mute`            | Toggle mute status                                                |
   | `reboot`          | Reboot the system                                                 |
   | `shutdown`        | Shutdown the system                                               |
   | `askConfirm`      | Executes the confirm button of a question dialogue                |
   | `askCancel`       | Executes the cancel button of a question dialogue                 |
   | `messageBox`      | Send info to the renderer.                                        |
   |                   | *Argument*: config object for sweetalert2. Requires to define 'title' or 'html' { title: 'info to display' }  |
   | `imagesUpdated`   | Send the updated images array to the renderer.                    |
   |                   | *Argument*: the updated images object                             |
   | `reloadRenderer`  | Restart the renderer                                              |

   </details>

---

#### Properties

- **.config**
  A copy of the configuration options for the addon.

- **.logger**
  The logger object supports the methods `.info`, `.warn` and `.error` to output messages and supports multiple arguments.

  **exmaple write log output**
```js
// function interface
interface.logger.info('Info from addon');
interface.logger.warn('Warning from addon');
interface.logger.error('Error from addon');
//
// class interface
this.logger.info('Info from addon');
this.logger.warn('Warning from addon');
this.logger.error('Error from addon');
```  

- **.images**
  The images array from TeleFrame.

  ***WARNING:  This is the same object that is used by TeleFrame. Changes also affect the TeleFrame images object!***

---

### Skeleton for the **function interface**
<details>
<summary>click to show/hide the code</summary>

```js
/**
 * Listen to all available events and output to the logger
 * @param  {object} interface   object inherited from class AddonBase to register and send events
 */
const MyExampleAddonFunction = (interface) => {
  // register event listeners to do something awesome
  //interface.registerListener('newImage', () => interface.logger.info('New image arrived.'));

  // send an input event
  //interface.sendEvent('next');
};

if (typeof module !== 'undefined') {
  module.exports = MyExampleAddonFunction;
}
```

</details>

### Skeleton for the **class interface**
<details>
<summary>click to show/hide the code</summary>

```js
const {AddonBase} = require('${__dirname}/../../js/addonInterface');

class MyExampleAddonClass  extends AddonBase {
  constructor(config) {
    super(config);

    // register event listeners to do something awesome
    //this.registerListener('newImage', () => this.logger.info('New image arrived.'));

    // send an input event
    //this.sendEvent('next');
  }
}

if (typeof module !== 'undefined') {
  module.exports = MyExampleAddonClass;
}
```

</details>


## Configure addons

To enable and disable addons and set simple configuration options, the command-line tool `~/TeleFrame/tools/addon_control.sh` is available.

<details>
<summary>Click to show/hide syntax</summary>

```
Usage: addon_control.sh <command> [addonDir] [...arguments]

commands:

  enable  <addondir>  - enables the addon for the specified directory
  disable <addondir> - disables the addon for the specified directory.
                       This command does not remove the config
  remove  <addondir>  - disables the addon for the specified directory and
                       remove the config.
  config <addondir> <key> <value> -

    <key>     - of the configuration option to change
    <value>   - new value for option.key.
              <value> can be a number, boolean or quoted string
  status             - list addons of 'TeleFrame/addons' and the enabled status
  help, --help, -h   - outputs this page
```

</details>

### Example addon configurations

Suppose the addon `addons/newImageLED` was installed.
```sh
# enable addon
~/TeleFrame/tools/addon_control.sh enable newImageLED

# configure an option.
# For the <value> can be a number, boolean or quoted string.
# If more complex values are required e.g. an object, use an editor for configuration
~/TeleFrame/tools/addon_control.sh config newImageLED newLedPin 27

# disable addon
~/TeleFrame/tools/addon_control.sh disable newImageLED
```

## Addon examples

The following two addons examples should show what is possible and to illustrate the process.
These examples are not useful in normal operation.

To try an addon, copy the example addon folder from `examples` one level up to `addons`. See [Example walkthrough](#walkthrough-to-install-an-addon-example).

After that you can change the `index.js` in the folder and do your own experiments.

### Event monitoring example

This addon listens for all available events and logs them.

The example is available in both class and function versions.
**Please use only the class or function version at the same time, otherwise you will go crazy with all the log entries:-)**

- Function example:
[`addons/examples/functionExampleMonitor`](examples/functionExampleMonitor/index.js)

- class example:
[`addons/examples/classExampleMonitor`](examples/classExampleMonitor/index.js)

### Auto control example

This addon takes control of TeleFrame. Activate 'pause' and randomly send the commands 'next'|'previous' for 5-10 images.
Return control for 17-23 seconds and then start again.

The example is available in both class and function versions.
**Please use only the class or function version at the same time, otherwise you'll go crazy if the images change all the time:-)**

- Function example:
[`addons/examples/functionExampleMonitor`](examples/functionExampleAutoControl/index.js)

- class example:
[`addons/examples/classExampleMonitor`](examples/classExampleAutoControl/index.js)


### New image notification LED

This addon switches an LED when new images arriveand can be used in normal operation, but there are better solutions to implement it if a GPIO package is also installed.

See addon documentation: [TeleFrame addon - New image notification led](examples/newImageLED/README.md)

This example is only delivered using the function interface.


#### Walkthrough to install an addon example

To install the **functionExampleMonitor**, copy the folder `addons/examples/functionExampleMonitor` to `TeleFrame/addons` and call `tools/addon_control.sh enable functionExampleMonitor`.

```sh
cd ~/TeleFrame
cp -R addons/examples/functionExampleMonitor addons/functionExampleMonitor
tools/addon_control.sh enable functionExampleMonitor
```

Then Restart TeleFrame.

## Installing existing addons from **github**

Navigate to the folder `TeleFrame/addons` and execute `git clone https://github.com/<user>/<addon-repo>`.
If the addon requires installation, change to the new addon directory and execute `npm install`.

While the addon interface was developed, the addon [**TeleFrame-webRemote**](https://github.com/gegu/TeleFrame-webRemote) was created for testing and demonstration purposes.
**TeleFrame-webRemote** presents a more advanced example which make direct use of some objects of TeleFrame.

### Walkthrough

To install the [**TeleFrame-webRemote**](https://github.com/gegu/TeleFrame-webRemote) addon.
```sh
cd ~/TeleFrame/addons
git clone https://github.com/gegu/TeleFrame-webRemote
cd TeleFrame-webRemote
npm install
../../tools/addon_control.sh enable TeleFrame-webRemote
```
