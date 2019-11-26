![TeleFrame](.github/header.png)

![TeleFrame in action](.github/TeleFrame.gif)

<p align="center">
	<a><img src="https://img.shields.io/github/last-commit/LukeSkywalker92/TeleFrame.svg" alt="Latest Comit"></a>
<a><img src="https://img.shields.io/github/release/LukeSkywalker92/TeleFrame.svg" alt="Release"></a>
	<a href="https://david-dm.org/LukeSkywalker92/TeleFrame"><img src="https://david-dm.org/LukeSkywalker92/TeleFrame.svg" alt="david-dm"></a>
</p>

**TeleFrame** is an open source digital image frame that displays images and videos, which were send to an Telegram Bot.

## !!! IMPORTANT !!!
**Before updating to 2.0.0, please read the release notes of release 2.0.0**

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [Installation](#installation)
  - [Automatic Installation (Raspberry Pi only!)](#automatic-installation-raspberry-pi-only)
  - [Manual Installation](#manual-installation)
- [Configuration](#configuration)
- [Whitelist Chats](#whitelist-chats)
- [Voice Replies using TeleFrame](#voice-replies-using-teleframe)
- [Touchscreen support](#touchscreen-support)
- [Updating](#updating)
- [Bot only mode (no GUI)](#bot-only-mode-no-gui)
- [Building a TeleFrame](#building-a-teleframe)

## Installation

### Automatic Installation (Raspberry Pi only!)

*Electron*, the app wrapper around Teleframe, only supports the Raspberry Pi 2/3/4. The Raspberry Pi 0/1 is currently **not** supported.

Note that you will need to install the lastest full version of Raspbian, **don't use the Lite version**.

Execute the following command on your Raspberry Pi to install TeleFrame:

```bash
bash -c "$(curl -sL https://raw.githubusercontent.com/LukeSkywalker92/TeleFrame/master/tools/install_raspberry.sh)"
```

### Manual Installation

1. Download and install the latest *Node.js* version.
2. If you like to use the voice reply feature you need to install sox
3. Install *Electron* globally with `npm install -g electron`.
4. Clone the repository and check out the master branch: `git clone https://github.com/LukeSkywalker92/TeleFrame.git`
5. Enter the repository: `cd TeleFrame/`
6. Install and run the app with: `npm install && npm start`

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

| **Option**           | **Description**                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `botToken`           | The token of the Telegram Bot, which will recieve the images. How to create a bot and get the token is explained [here](https://core.telegram.org/bots#6-botfather). |
| `whitelistChats`     | Use this to only allow certain users to send photos to your TeleFrame. See hints below.                                                                              |
| `playSoundOnRecieve` | Play a sound on recieving a message, set `false` to turn off.                                                                                                        |
| `showVideos`         | When set to true, videos that are send to the bot are also shown.                                                                                                    |
| `playVideoAudio`     | If recieved videos should be played with sound or not.                                                                                                               |
| `imageFolder`        | The folder where the images are stored.                                                                                                                              |
| `fullscreen`         | When set to true, TeleFrame will run in fullscreen mode.                                                                                                             |
| `fadeTime`           | The fading time between two images.                                                                                                                                  |
| `interval`           | The time that an image is shown.                                                                                                                                     |
| `imageCount`         | Defines how many different images are shown in the slideshow.                                                                                                        |
| `newPhotoMessage`    | Message that is shown when the bot recieved a new image.                                                                                                             |
| `newVideoMessage`    | Message that is shown when the bot recieved a new video.                                                                                                             |
| `showSender`         | When set to true, TeleFrame will show the name of the sender when the image is shown.                                                                                |
| `showCaption`        | When set to true, TeleFrame will show the caption of the image when the image is shown.                                                                              |
| `fullscreen`         | When set to true, TeleFrame will run in fullscreen mode.                                                                                                             |
| `toggleMonitor`      | When set to true, TeleFrame will switch the monitor off and on at the defined hours.                                                                                 |
| `turnOnHour`         | Defines when the monitor shuld be turned on.                                                                                                                         |
| `turnOffHour`        | Defines when the monitor shuld be turned off.                                                                                                                        |
| `keys`               | Defines an object with 4 strings specifying the keyboard shortcuts for play, next, previous and pause. Set to null for no controls                                   |
| `voiceReply`         | Defines an object with the config for sending voicemessages with TeleFrame, see info bellow                                                                          |
| `touchBar`         | Defines an object with the config for using a touch bar for executing commands instead of the default touch gestures.|


## Whitelist Chats

When you start your TeleFrame and send a "Hi" to the bot it will send you back the current chat id. Paste this id or several of them into the `whitelistChats` config option to only allow only pictures from these ids (eg `[1234567, 89101010]`). Leave empty (`[]`) for no whitelist.

## Using the Touch Bar

To use a touch bar for executing commands instead of the default touch gestures you need to add a touchBar obect to your config.
To open the touch bar, just touch the screen. Do the same to hide it again.
The touchBar object takes the height of the touchbar and a list of elements that should appear as keys. Availiable elements are:

| **Element**             | **Description**                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| `previousImage`         | Navigate to the previous Image. 																													|
| `nextImage`  						| Navigate to the next Image. 																															|
| `play`         					| Resume slideshow. 																																				|
| `pause` 								| Pause slideshow. 																																					|
| `playPause`  					  | Toggle between play and pause. 																														|
| `record`         				| Record voice reply. 																																			|
| `starImage`        			| Star the active image to prevent it from beeing deleted. 																					|
| `deleteImage`        		| Delete the active an image. 																																					|
| `mute`        					| Mute notification sounds. 																																|
| `shutdown`        			| Shutdown the system. 																																			|
| `reboot`        				| Reboot the system. 																																				|

## Voice Replies using TeleFrame

A very simple way to respond to the images is by using TeleFrame`s voice reply feature. The feature is intended to work like this: Who ever comes by the frame presses a button, speaks their message into the frame, when there is 2 seconds of silence or the maximum time is reached the recording will stop and the telegram bot will send it to the chat where the current image came from.


| **Option**              | **Description**                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| `key`                   | The keyboardkey to start the voice recording                                              |
| `maxRecordTime`         | How long the recorder will record if there is no silence detected (in milliseconds)       |
| `recordingMessageTitle` | The title of the recording dialog displayed on the frame during record                    |
| `recordingPreMessage`   | The message of the recording dialog displayed on the frame during record before chat name |
| `recordingPostMessage`  | The message of the recording dialog displayed on the frame during record after char name  |
| `recordingDone`         | The message of the recording dialog displayed on the frame when recording has finished    |
| `recordingError`        | The error message of the recording dialog displayed when recording has failed             |

## Touchscreen support
* Navigate through the images by touching at the left or right side of your touchscreen.
* Pause and resume the slideshow by touching in the middle of your touchscreen.
* Record a voice message and reply to the shown image by making a long touch in the middle of your touchscreen. The recording starts when you take your finger off.

## Updating

If you want to update your TeleFrame to the latest version, use your terminal to go to your TeleFrame folder and type the following command:

```bash
git pull && npm install
```

If you changed nothing more than the config, this should work without any problems.
Type `git status` to see your changes, if there are any, you can reset them with `git reset --hard`. After that, git pull should be possible.

## Bot only mode (no GUI)

To run only the bot (without GUI), that saves the recieved images and videos into the folder specified in the config you need to run

```bash
npm run botonly
```
in the TeleFrame folder.

## Building a TeleFrame

A detailed instruction on how to build your own TeleFrame will follow soon.
