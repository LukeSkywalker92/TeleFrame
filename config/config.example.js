var config = {
  botToken: "",
  whitelistChats: [],
  playSoundOnRecieve: "sound1.mp3",
  showVideos: true,
  playVideoAudio: false,
  imageFolder: "images",
  fullscreen: true,
  fadeTime: 1500,
  interval: 10 * 1000,
  imageCount: 30,
  newPhotoMessage: "New image from",
  newVideoMessage: "New video from",
  showSender: true,
  showCaption: true,
  // To output sender caption, use the entire screen
  useFullscreenForCaptionAndSender: true,
  // Defines the percentage of the duration of <interval> to show sender and caption.
  // minimum value: 10  = fade out after 10% of <interval>
  // maximum value: 100 = full time. sender and caption does not fade out
  senderAndCaptionDuration: 50,
  toggleMonitor: false,
  turnOnHour: 9,
  turnOffHour: 22,
  // show confirm message before delete an image
  confirmDeleteImage: true,
  deleteMessage: "Really remove?",
  deleteConfirmText: "Remove",
  deleteCancelText: "Cancel",
  // show confirm message before shutdown
  confirmShutdown: true,
  shutdownMessage: "Really shutdown?",
  shutdownConfirmText: "Shutdown",
  shutdownCancelText: "Cancel",
  // show confirm message before reboot
  confirmReboot: true,
  rebootMessage: "Really rboot?",
  rebootConfirmText: "Reboot",
  rebootCancelText: "Cancel",
  touchBar: {
    height: "75px",
    // timout to automatically hide the touchbar.
    // To disable auto hide set value to 0
    autoHideTimeout: 30 * 1000,
    elements: [
      "previousImage",
      "playPause",
      "nextImage",
      "record",
      "starImage",
      "deleteImage",
      "mute",
      "shutdown",
      "reboot"
    ]
  },
  keys: {
    next: "right",
    previous: "left",
    play: "l",
    pause: "k"
  },
  voiceReply: {
    key: "a",
    maxRecordTime: 60*1000,
    recordingMessageTitle: "Voice Message",
    recordingPreMessage: "Recording for",
    recordingPostMessage: "in progress...",
    recordingDone: "Voice message sent sucessfully!",
    recordingError: "Voice message has failed!"
  }
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = config;
}
