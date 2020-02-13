# TeleFrame addon - New image notification led

This example addon switches an LED when new images arrive. It can be used in normal operation, but there are better solutions to implement it if a GPIO package is also installed.

Unfortunately, the available GPIO packages all have dependencies where problems may occur during installation.
Therefore the switching of the LED was implemented via executing a system command using the `gpio` utility.
This should work on all Raspberry PI's. It is not very efficiently, but should be sufficient for demonstration purposes.

---
### Installation

**You must define the GPIO port for the LED to be switched in the configuration. Otherwise the addon will not be executed.**

If you are not sure which GPIO port to configure, you can run the `pinout` tool. The number after **GPIO** is required.

To install the **newImageLED**  addon example open a terminal and execute:

```sh
cd ~/TeleFrame
cp -R addons/examples/newImageLED addons/newImageLED
tools/addon_control.sh enable newImageLED
tools/addon_control.sh config newImageLED newLedGPIO <your LED GPIO port number>
```

Then restart TeleFrame.


**If you are using an Raspberry Pi 4B and want to try this example, make sure you have at least wiringPi version 2.52 installed.**
To check the version use `gpio -v`.

You can use the following commands to update wiringPi:
```sh
WPI_DEB="$(mktemp)" &&
wget -O "$WPI_DEB" 'https://project-downloads.drogon.net/wiringpi-latest.deb' && sudo dpkg -i "$WPI_DEB"
rm -f "$WPI_DEB"
```


### Configuration options

The following configuration options are available.

| Name          | Type   | Description                                                      |
| ------------- | ------ | ---------------------------------------------------------------- |
| newLedGPIO    | number | **required**: GPIO port to use to switch the LED                |
| blinkInterval | number | _optional_: duration in milliseconds during the LED is on or off |
