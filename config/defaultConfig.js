var defaultConfig = {
  // The token of the Telegram Bot, which will recieve the images.
  // How to create a bot and get the token is explained [here](https://core.telegram.org/bots#6-botfather)
  //botToken: '<your bot token>',

  // Use this to only allow certain users to send photos to your TeleFrame. See hints in README.md
  whitelistChats: [],

  // Play a sound on recieving a message, set `false` to turn off
  playSoundOnRecieve: "sound1.mp3",

  // When set to true, videos that are send to the bot are also shown
  showVideos: true,

  // If recieved videos should be played with sound or not
  playVideoAudio: false,

  // The folder where the images are stored
  imageFolder: "images",

  // When set to true, TeleFrame will run in fullscreen mode
  fullscreen: true,

  // The fading time between two images
  fadeTime: 1500,

  // The time that an image is shown.
  interval: 10 * 1000,

  // Defines how many different images are shown in the slideshow.
  imageCount: 30,

  //When set to true, TeleFrame will show the name of the sender when the image is shown
  showSender: true,

  // When set to true, TeleFrame will show the caption of the image when the image is shown.
  showCaption: true,

  // When set to true, TeleFrame will switch the monitor off and on at the defined hours.
  toggleMonitor: false,

  // Defines when the monitor shuld be turned on.
  turnOnHour: 9,

  // Defines when the monitor shuld be turned off.
  turnOffHour: 22,

  touchBar: {
    height: "75px",
    // timout to automatically hide the touchbar.
    // To disable auto hide set value to 0
    autoHideTimeout: 30 * 1000,

    // Defines an objectspecifying the touchbar icons to enable
    elements: [
      // Navigate to the previous Image.
      "previousImage",

      //Navigate to the next Image.
      "nextImage",

      //  Resume slideshow.
      // "play",

      // Pause slideshow.
      // "Pause",

      // Toggle between play and pause
      "playPause",

      // Record voice reply.
      "record",

      // Star the active image to prevent it from beeing deleted.
      "starImage",

      //  Delete the active an image.
      "deleteImage",

      // Mute notification sounds.
      "mute",

      //Shutdown the system.
      "shutdown",

      // Reboot the system.
      "reboot"
    ]
  },

  // Defines an object with 4 strings specifying the keyboard shortcuts for
  // play, next, previous and pause. Set to null for no controls
  keys: {
    next: "right",
    previous: "left",
    play: "l",
    pause: "k"
  },

  // Defines an object with the config for sending voicemessages with TeleFrame
  voiceReply: {
    //  The keyboardkey to start the voice recording
    key: "a",

    // How long the recorder will record if there is no silence detected (in milliseconds)
    maxRecordTime: 60*1000,
  }
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = defaultConfig;
}
