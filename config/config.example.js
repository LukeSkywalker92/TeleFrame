var config = {
  botToken: '',
  whitelistChats: [],
	showVideos: true,
  playVideoAudio: false,
  imageFolder: 'images',
  fullscreen: true,
  fadeTime: 1500,
  interval: 10 * 1000,
  imageCount: 30,
  newPhotoMessage: 'Neues Foto von',
	newVideoMessage: 'Neues Video von',
  showSender: true,
  showCaption: true,
  toggleMonitor: true,
  turnOnHour: 9,
  turnOffHour: 22,
  keys: {
    next: "right",
    previous: "left",
    play: "l",
    pause: "k"
  }
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
