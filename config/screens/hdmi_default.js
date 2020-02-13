/*
 * settings for standard screen connected via HDMI
 *
 */
var screen = {
    name: "Standard HDMI screen",
    xres: 1024,
    yres: 600,
    aspectRatio: 1.0, // defines the aspect ratio of a pixel (width/height)
    hasTouch: true,
    hasBacklightCtl: true,
    hasBacklightDimming: false,
    cmdInit: "",
    cmdBacklightOff: "tvservice -o",
    cmdBacklightOn:  "tvservice --preferred && sudo chvt 6 && sudo chvt 7",
    cmdBacklightDimming: "",
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = screen;
}
