![TeleFrame](.github/header.png)

**TeleFrame** is an open source digital image frame that displays images, which were send to an Telegram Bot.

## Table Of Contents

- [Installation](#installation)
  - [Raspberry Pi](#automatic-installation-raspberry-pi-only)
  - [General](#manual-installation)
- [Configuration](#configuration)
- [Updating](#updating)
- [Building a TeleFrame](#building-a-teleframe)

## Installation

### Automatic Installation (Raspberry Pi only!)

*Electron*, the app wrapper around Teleframe, only supports the Raspberry Pi 2/3. The Raspberry Pi 0/1 is currently **not** supported.

Note that you will need to install the lastest full version of Raspbian, **don't use the Lite version**.

Execute the following command on your Raspberry Pi to install MagicMirror²:

```bash
bash -c "$(curl -sL https://raw.githubusercontent.com/LukeSkywalker92/TeleFrame/master/tools/install_raspberry.sh)"
```

### Manual Installation

1. Download and install the latest *Node.js* version.
2. Install *Electron* globally with `npm install -g electron`.
3. Clone the repository and check out the master branch: `git clone https://github.com/LukeSkywalker92/TeleFrame.git`
4. Enter the repository: `cd TeleFrame/`
5. Install and run the app with: `npm install && npm start`

Also note that:

- `npm start` does **not** work via SSH. But you can use `DISPLAY=:0 nohup npm start &` instead. \
  This starts the TeleFrame on the remote display.
- To access toolbar menu when in fullscreen mode, hit `ALT` key.
- To toggle the (web) `Developer Tools` from fullscreen mode, use `CTRL-SHIFT-I` or `ALT` and select `View`.

## Configuration

1. Copy `TeleFrame/config/config.js.example` to `TeleFrame/config/config.js`. \
   **Note:** If you used the installer script. This step is already done for you.

2. Modify your required settings.


The following properties can be configured:

| **Option** | **Description** |
| --- | --- |
| `botToken` | The token of the Telegram Bot, which will recieve the images. How to create a bot and get the token is explained [here](https://core.telegram.org/bots#6-botfather). |
| `imageFolder` | The folder where the images are stored. |
| `fadeTime` | The fading time between two images. |
| `interval` | The time that an image is shown. |
| `imageCount` | Defines how many different images are shown in the slideshow. |
| `newPhotoMessage` | Message that is shown when the bot recieved a new image. |
| `fullscreen` | When set to true, TeleFrame will run in fullscreen mode. |
| `turnOnHour` | Defines when the monitor shuld be turned on. |
| `turnOffHour` | Defines when the monitor shuld be turned off. |

## Updating

If you want to update your TeleFrame to the latest version, use your terminal to go to your TeleFrame folder and type the following command:

```bash
git pull && npm install
```

If you changed nothing more than the config, this should work without any problems.
Type `git status` to see your changes, if there are any, you can reset them with `git reset --hard`. After that, git pull should be possible.

## Building a TeleFrame

A detailed instruction on how to build your own TeleFrame will follow soon.
