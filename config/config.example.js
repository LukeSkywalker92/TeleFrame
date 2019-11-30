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
  toggleMonitor: false,
  turnOnHour: 9,
  turnOffHour: 22,
  // show confirm message before delete an image
  confirmDeleteImage: true,
  deleteMessage: "Really remove?",
  deleteConfirmText: "Remove",
  deleteCancelText: "Cancel",
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
