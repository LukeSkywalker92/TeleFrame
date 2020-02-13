# Screen configuration files
A screen configuration contains commands to switch the screen on/off.

## options

The following options are available:

| **Option**             | **Type**   | **Description**                                                             |
|------------------------|------------|-----------------------------------------------------------------------------|
| `name`                 | {string}   | Screen configuration name                                                   |
| `xres`                 | {number}   | screen x resolution  - _currently not in use_                               |
| `yres`                 | {number}   | screen y resolution  - _currently not in use_                               |
| `aspectRatio`          | {float}    | defines the aspect ratio of a pixel (width/height) - _currently not in use_ |
| `hasTouch`             | {boolean}  | has touch function - _currently not in use_                                 |
| `hasBacklightCtl`      | {boolean}  | has backlight control - -_currently not in use_                             |
| `hasBacklightDimming`  | {boolean}  | has backlight dimming  - _currently not in use_                             |
| `cmdInit`              | {string}   | command to initialize switching                                             |
| `cmdBacklightOff`      | {string}   | execute command to turn screen on                                           |
| `cmdBacklightOn`       | {string}   | execute command to turn screen off                                          |
| `cmdBacklightDimming`: | {string}   | execute command to dimm the backlight - _currently not in use_              |
| `init`                 | {function} | **optional** function to initialize the commands using `screenSwitchOptions` from `config.js`. See example below |

If the commands require parameters which must be configured by the user - e.g. a GPIO pin for the RPI, the function `init` can be defined optionally.
This function is called when the configuration is initialized and the object config.screenSwitchOptions is passed.

Example config using `init` function
```js
/*
* settings for Sunfounder 10.1 inch touch sreen connected via HDMI
* http://wiki.sunfounder.cc/index.php?title=10.1_Inch_Touch_Screen_for_Raspberry_Pi
*
* This screen is turned on and off via a GPIO port, because when HDMI is turned off
* via software, the text "No Signal" is permanently displayed.
*
* To control the power switch an additional script and some hardware (optocoupler
* and a resistor) is required.

  THE PIN NEEDS TO BE CONFIGURED MANUALLY IN YOUR config/config.json
  It depends on your individual setup, to which
  Pin the optocoupler is connected to.

  Example config.json:
  {
    "botToken": "...",
    ...
    "screenConfig": "./screens/hdmi_sunfounder_10-1_Inch_touch_screen.js",
    "screenSwitchOptions": { "pin": 29 },
    ...
  }
*/
var screen = {
    name: "Sunfounder HDMI screen",
    xres: 1280,
    yres: 800,
    aspectRatio: 1.0, // defines the aspect ratio of a pixel (width/height)
    hasTouch: true,
    hasBacklightCtl: false,
    hasBacklightDimming: false,
    cmdBacklightDimming: "",
    /**
     * initialize the command strings
     * @param  {Object} options The screenSwitchOptions object from config.json
     * @param  {Object} logger The logger object from schedules
     */
    init: (options, logger) => {
      // check configuration option
      if (typeof options.pin !== 'number') {
        const errorMsg = 'ERROR! screen.init() "' + screen.name + '"! Missing or invalid configuration of "screenSwitchOptions.pin" in config.js.';
        logger.warn(errorMsg);
        ['cmdInit', 'cmdBacklightOff', 'cmdBacklightOn'].forEach((e) => screen[e] = 'echo ' + errorMsg);
      } else {
        screen.cmdInit = "gpio mode " + options.pin + " out";
        screen.cmdBacklightOff = "bash ./tools/screen_switch.sh " + options.pin;
        screen.cmdBacklightOn =  "bash ./tools/screen_switch.sh " + options.pin;
      }      
    }
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = screen;
}
```
 See also the wiki page [How to switch off the Sunfounder 10.1 inch HDMI display via the toggleMonitor function](https://github.com/LukeSkywalker92/TeleFrame/wiki/How-to-switch-off-the-Sunfounder-10.1-inch-HDMI-display-via-the-toggleMonitor-function) for this example.
