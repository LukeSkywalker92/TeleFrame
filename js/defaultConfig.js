var defaultConfig = {
  // The token of the Telegram Bot, which will recieve the images.
  // How to create a bot and get the token is explained [here](https://core.telegram.org/bots#6-botfather)
  // If you want to disable the bot because you might use an addon that updates the images, use
  //   botToken: 'bot-disabled',
  //botToken: '<your bot token>',

  // Use this to only allow certain users to send photos to your TeleFrame. See hints in README.md
  whitelistChats: [],

  // Use this to name individual users as Admin. See hints in README.md
  whitelistAdmins: [],

  // Use this to configure the connected screen
  // A standard HDMI screen is used by default.
  screenConfig: "./config/screens/hdmi_default.js",

  // Object to define options for the specified screenConfig.
  // Check the screens/<config>.js if it requires configuration.
  // This obejct will be passed to the screen.configure() member, if defined.
  // For example - screenSwitchOptions: { pin: 29}
  screenSwitchOptions: {},

  // Define the language to use.
  // If the language is not defined, the system language is loaded, if available.
  // If no language file could be determined, English is used by default.
  // language: "en",

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

  // When set to true, Teleframe will show pictures in random order.
  randomOrder: true,

  // Defines if old images are deleted, when they are no longer used in the slideshow (see 'imageCount'). Starred images will not be deleted.
  autoDeleteImages: true,

  // When set to true, TeleFrame will show the name of the sender when the image is shown
  showSender: true,

  // When set to true, TeleFrame will show the caption of the image when the image is shown.
  showCaption: true,

  // When set to true, TeleFrame will crop and zoom images so there is no black border.
  cropZoomImages: false,

  // Defines the percentage of the duration of <interval> to show sender and caption.
  // minimum value: 10  = fade out after 10% of <interval>
  // maximum value: 100 = full time. sender and caption does not fade out
  senderAndCaptionDuration: 50,

  // To output sender caption, use the entire screen
  useFullscreenForCaptionAndSender: true,

  // When set to true, TeleFrame will switch the monitor off and on at the defined hours.
  toggleMonitor: false,

  // Defines when the monitor shuld be turned on.
  turnOnHour: 9,

  // Defines when the monitor shuld be turned off.
  turnOffHour: 22,

  // Defines if the bot should answer on images or videos with a short reply
  botReply: true,

  // Defines if the 2 LEDs of the Raspberry board are switched off
  switchLedsOff: false,

  touchBar: {
    height: "75px",
    // timout to automatically hide the touchbar.
    // To disable auto hide set value to 0
    autoHideTimeout: 30 * 1000,

    // Defines an objectspecifying the touchbar icons to enable
    elements: [
      // Show the recently arrived images.
      "showNewest",

      // Navigate to the previous image.
      "previousImage",

      //Navigate to the next image.
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
  },

  // Defines an object with the config for sending Admin-Commands to the TeleFrame
  adminAction: {
	//Global Switch to enable the Admin-Actions
    allowAdminAction: true,

	  //Defines an array of action-objects
	  actions: [
		// Example Admin-Action:
		{
			// Name of the action
			name: "echo",
			// Command to execute on TeleFrame
			command: 'echo test',
			// Switch to add the command to the bot
			enable: true
		},

		// Admin-Action for Rebooting the device
		{name: "reboot", command: "sudo reboot", enable: true},
		// Admin-Action for shuting the device down
		{name: "shutdown", command: "sudo shutdown -h now ", enable: true},
		// Admin-Action for restart the TeleFrame-Application
		{name: "restart", command: "pm2 restart all", enable: true},
		// Admin-Action for starting the OpenVPN-Client
		{name: "startOpenvpn", command: "systemctl openvpn start", enable: true},
		// Admin-Action for stoping the OpenVPN-Client
		{name: "stopOpenvpn", command: "systemctl openvpn stop", enable: true}
    ]
  },

  // options for the addonHandler class
  addonInterface: {
    // configure which types should be logged
    logging: ['info', 'warn', 'error'],
    // The AddonInterface will try to load all configured addons.
    // To enable an addon it requires at least the directory name from
    // the addons folder as the key and an empty config object.
    // for example: "testAddon": {}
    addons: {
    }
  }
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = defaultConfig;
}
