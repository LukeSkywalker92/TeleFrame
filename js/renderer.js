const {
  remote,
  ipcRenderer
} = require("electron");
const $ = require("jquery");
window.jQuery = $;
const Swal = require("sweetalert2");
const randomColor = require("randomcolor");
const chroma = require("chroma-js");
const velocity = require("velocity-animate");
const logger = remote.getGlobal("rendererLogger");
const config = remote.getGlobal("config");


logger.info("Renderer started ...");

var images = remote.getGlobal("images");
var container = document.getElementById("container");
var currentTimeout;
var isPaused = false;
var currentImageIndex = images.length;
var startTime, endTime, longpress, timeout, recordSwal, currentChatId, currentMessageId;

if (config.playSoundOnRecieve != false) {
  var audio = new Audio(__dirname + "/sound1.mp3");
}

$("body").on('touchstart', function() {
  startTime = new Date().getTime();
  currentImageForVoiceReply = images[currentImageIndex]
});

$("body").on('touchend', function(event) {
  endTime = new Date().getTime();
  longpress = (endTime - startTime > 500) ? true : false;
  tapPos = event.originalEvent.changedTouches[0].pageX
  containerWidth = $("body").width()
  if (tapPos / containerWidth < 0.2) {
    previousImage()
  } else if (tapPos / containerWidth > 0.8) {
    nextImage()
  } else {
    if (longpress) {
      ipcRenderer.send("record", currentImageForVoiceReply['chatId'], currentImageForVoiceReply['messageId']);
    } else {
      if (isPaused) {
        play()
      } else {
        pause()
      }
    }
  }
});

ipcRenderer.on("recordButtonPressed", function(event, arg) {
  currentImageForVoiceReply = images[currentImageIndex]
  ipcRenderer.send("record", currentImageForVoiceReply['chatId'], currentImageForVoiceReply['messageId']);
});


//handle new incoming image
ipcRenderer.on("recordStarted", function(event, arg) {
  let message = document.createElement("div");
  let spinner = document.createElement("div");
  spinner.classList.add("spinner");
  message.appendChild(spinner);
  let text = document.createElement("p");
  messageText = config.voiceReply.recordingPreMessage
                    + ' ' + currentImageForVoiceReply['chatName']
                    + ' ' + config.voiceReply.recordingPostMessage;
  text.innerHTML = messageText
  message.appendChild(text);
  recordSwal = Swal.fire({
    title: config.voiceReply.recordingMessageTitle,
    showConfirmButton: false,
    html: message
  });
});

ipcRenderer.on("recordStopped", function(event, arg) {
  let message = document.createElement("div");
  let text = document.createElement("p");
  text.innerHTML = config.voiceReply.recordingDone
                    + ' ' + currentImageForVoiceReply['chatName'];
  message.appendChild(text);
  recordSwal.close();
  Swal.fire({
    html: message,
    title: config.voiceReply.recordingMessageTitle,
    showConfirmButton: false,
    type: "success",
    timer: 5000
  });
});

ipcRenderer.on("recordError", function(event, arg) {
  let message = document.createElement("div");
  let text = document.createElement("p");
  text.innerHTML = config.voiceReply.recordingError;
  message.appendChild(text);
  recordSwal.close();
  Swal.fire({
    html: message,
    title: config.voiceReply.recordingMessageTitle,
    showConfirmButton: false,
    icon: "error",
    timer: 5000
  });
});

ipcRenderer.on("newImage", function(event, arg) {
  newImage(arg.sender, arg.type);
  if (config.playSoundOnRecieve != false) {
    audio.play();
  }
});

ipcRenderer.on("next", function(event, arg) {
  nextImage()
});

ipcRenderer.on("previous", function(event, arg) {
  previousImage()
});

ipcRenderer.on("pause", function(event, arg) {
  pause()
});

ipcRenderer.on("play", function(event, arg) {
  play()
});

function showPause() {
  var pauseBox = document.createElement("div");
  var div1 = document.createElement("div");
  var div2 = document.createElement("div");

  pauseBox.id = "pauseBox";
  pauseBox.style =
    "height:50px;width:45px;position:absolute;top:20px;right:20px";

  pauseBox.appendChild(div1);
  pauseBox.appendChild(div2);

  div1.style =
    "height:50px;width:15px;background-color:blue;float:left;border-radius:2px";
  div2.style =
    "height:50px;width:15px;background-color:blue;float:right;border-radius:2px";

  container.appendChild(pauseBox);
}

function hidePause() {
  let node = document.getElementById("pauseBox");
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

function nextImage() {
  if (isPaused) hidePause();
  loadImage(true, 0);
  if (isPaused) showPause();
}

function previousImage() {
  if (isPaused) hidePause();
  loadImage(false, 0);
  if (isPaused) showPause();
}

function pause() {
  if (isPaused) return;

  isPaused = true;
  clearTimeout(currentTimeout);
  showPause(isPaused);
}

function play() {
  if (!isPaused) return;

  isPaused = false;
  loadImage(true, 0);
  hidePause(isPaused);
}

//load imge to slideshow
function loadImage(isNext, fadeTime, goToLatest = false) {
  clearTimeout(currentTimeout);

  if (images.length == 0) {
    currentTimeout = setTimeout(() => {
      loadImage(true, fadeTime);
    }, config.interval);
    return;
  }

  // get image path and increase currentImageIndex for next image
  if (isNext) {
    if (currentImageIndex >= images.length - 1) {
      currentImageIndex = 0;
    } else {
      currentImageIndex++;
    }
  } else {
    currentImageIndex--;
    if (currentImageIndex < 0) currentImageIndex = images.length - 1;
  }

  var image = images[currentImageIndex];

  //get current container and create needed elements
  var currentImage = container.firstElementChild;
  var div = document.createElement("div");
  var img;
  if (image.src.split(".").pop() == "mp4") {
    img = document.createElement("video");
    img.muted = !config.playVideoAudio;
    img.autoplay = true;
  } else {
    img = document.createElement("img");
  }
  var sender = document.createElement("span");
  var caption = document.createElement("span");

  //create background and font colors for sender and caption
  var backgroundColor = randomColor({
    luminosity: "dark",
    alpha: 1
  });
  var fontColor = randomColor({
    luminosity: "light",
    alpha: 1
  });
  //when contrast between background color and font color is too small to
  //make the text readable, recreate colors
  while (chroma.contrast(backgroundColor, fontColor) < 4.5) {
    backgroundColor = randomColor({
      luminosity: "dark",
      alpha: 1
    });
    fontColor = randomColor({
      luminosity: "light",
      alpha: 1
    });
  }

  //set class names and style attributes
  img.src = image.src;
  img.className = "image";
  div.className = "imgcontainer";
  sender.className = "sender";
  caption.className = "caption";
  caption.id = "caption";
  sender.innerHTML = image.sender;
  caption.innerHTML = image.caption;
  sender.style.backgroundColor = backgroundColor;
  caption.style.backgroundColor = backgroundColor;
  sender.style.color = fontColor;
  caption.style.color = fontColor;

  //generate some randomness for positions of sender and caption
  if (Math.random() >= 0.5) {
    sender.style.left = 0;
    sender.style.borderTopRightRadius = "10px";
    sender.style.borderBottomRightRadius = "10px";
  } else {
    sender.style.right = 0;
    sender.style.borderTopLeftRadius = "10px";
    sender.style.borderBottomLeftRadius = "10px";
  }
  if (Math.random() >= 0.5) {
    caption.style.left = 0;
    caption.style.borderTopRightRadius = "10px";
    caption.style.borderBottomRightRadius = "10px";
  } else {
    caption.style.right = 0;
    caption.style.borderTopLeftRadius = "10px";
    caption.style.borderBottomLeftRadius = "10px";
  }
  if (Math.random() >= 0.5) {
    sender.style.top = "2%";
    caption.style.bottom = "2%";
  } else {
    sender.style.bottom = "2%";
    caption.style.top = "2%";
  }

  //calculate aspect ratio to show complete image on the screen and
  //fade in new image while fading out the old image as soon as
  //the new imageis loaded
  if (image.src.split(".").pop() == "mp4") {
    img.onloadeddata = function() {
      screenAspectRatio =
        remote
        .getCurrentWindow()
        .webContents.getOwnerBrowserWindow()
        .getBounds().width /
        remote
        .getCurrentWindow()
        .webContents.getOwnerBrowserWindow()
        .getBounds().height;
      imageAspectRatio = img.naturalWidth / img.naturalHeight;
      if (imageAspectRatio > screenAspectRatio) {
        img.style.width = "100%";
        div.style.width = "100%";
      } else {
        img.style.height = "100%";
        div.style.height = "100%";
      }
      $(div).velocity("fadeIn", {
        duration: fadeTime
      });
      $(currentImage).velocity("fadeOut", {
        duration: fadeTime
      });
      if (!isPaused) {
        currentTimeout = setTimeout(() => {
          loadImage(true, fadeTime);
        }, img.duration * 1000);
      }
    };
  } else {
    img.onload = function() {
      screenAspectRatio =
        remote
        .getCurrentWindow()
        .webContents.getOwnerBrowserWindow()
        .getBounds().width /
        remote
        .getCurrentWindow()
        .webContents.getOwnerBrowserWindow()
        .getBounds().height;
      imageAspectRatio = img.naturalWidth / img.naturalHeight;
      if (imageAspectRatio > screenAspectRatio) {
        img.style.width = "100%";
        div.style.width = "100%";
      } else {
        img.style.height = "100%";
        div.style.height = "100%";
      }
      $(div).velocity("fadeIn", {
        duration: fadeTime
      });
      $(currentImage).velocity("fadeOut", {
        duration: fadeTime
      });
      if (!isPaused) {
        currentTimeout = setTimeout(() => {
          loadImage(true, config.fadeTime);
        }, config.interval);
      }
    };
  }

  div.appendChild(img);
  if (config.showSender) {
    div.appendChild(sender);
  }
  if (config.showCaption && image.caption !== undefined) {
    div.appendChild(caption);
  }
  setTimeout(function() {
    container.removeChild(currentImage);
  }, fadeTime)

  container.appendChild(div);

  //fade out sender and caption at half time of the shown image
  setTimeout(function() {
    $(sender).velocity("fadeOut", {
      duration: fadeTime / 2
    });
    $(caption).velocity("fadeOut", {
      duration: fadeTime / 2
    });
  }, config.interval / 2);
}

//notify user of incoming image and restart slideshow with the newest image
function newImage(sender, type) {
  images = remote.getGlobal("images");
  if (type == "image") {
    Swal.fire({
      title: config.newPhotoMessage + " " + sender,
      showConfirmButton: false,
      timer: 5000,
      type: "success"
    }).then((value) => {
      currentImageIndex = images.length;
      loadImage(true, 0);
    });
  } else if (type == "video") {
    Swal.fire({
      title: config.newVideoMessage + " " + sender,
      showConfirmButton: false,
      timer: 5000,
      type: "success"
    }).then((value) => {
      currentImageIndex = images.length;
      loadImage(true, 0);
    });
  }
}

//start slideshow of images
loadImage(true, config.fadeTime);
