var config = {
  botToken: "",
  whitelistChats: [],
  whitelistAdmins: [],
  playSoundOnRecieve: "sound1.mp3",
  showVideos: true,
  playVideoAudio: false,
  imageFolder: "images",
  fullscreen: true,
  fadeTime: 1500,
  interval: 10 * 1000,
  imageCount: 30,
  newPhotoMessage: "Neues Foto von",
  newVideoMessage: "Neues Video von",
  showSender: true,
  showCaption: true,
  toggleMonitor: false,
  turnOnHour: 9,
  turnOffHour: 22,
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
  },
  adminAction: {
    allowAdminAction: false,
    actions: [
      {name: "echo", command: 'echo test', enable: true},
      {name: "reboot", command: "sudo reboot", enable: true},
      {name: "shutdown", command: "sudo shutdown -h now ", enable: true},
      {name: "restart", command: "pm2 restart all", enable: true},
      {name: "startOpenvpn", command: "systemctl openvpn start", enable: true},
      {name: "stopOpenvpn", command: '', enable: true}
    ]
  }
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = config;
}
