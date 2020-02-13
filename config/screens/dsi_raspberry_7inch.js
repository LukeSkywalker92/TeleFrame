/*
 * settings for the official Raspberry Pi 7'' screen connected via DSI
 *
 */
var screen = {
    name: "Raspberry Pi 7'' DSI screen",
    xres: 800,
    yres: 480,
    aspectRatio: 1.0, // defines the aspect ratio of a pixel (width/height)
    hasTouch: true,
    hasBacklightCtl: true,
    hasBacklightDimming: true,
    cmdInit: "sudo chmod 666 /sys/class/backlight/rpi_backlight/bl_power /sys/class/backlight/rpi_backlight/brightness",
    cmdBacklightOff: "sudo echo 1 > /sys/class/backlight/rpi_backlight/bl_power",
    cmdBacklightOn:  "sudo echo 0 > /sys/class/backlight/rpi_backlight/bl_power",
    cmdBacklightDimming: "sudo echo %% >/sys/class/backlight/rpi_backlight/brightness",
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = screen;
}
