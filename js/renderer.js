const { remote, ipcRenderer } = require("electron");
const $ = require("jquery");
window.jQuery = $;
const swal = require("sweetalert");
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

if (config.playSoundOnRecieve != false) {
  var audio = new Audio(__dirname + "/sound1.mp3");
}

//handle new incoming image
ipcRenderer.on("recordStarted", function(event, arg) {
  // TODO: add spinner here
  swal(config.voiceReply.recordingMessage, {
    title: config.voiceReply.recordingMessageTitle,
    buttons: false
  });
});

ipcRenderer.on("recordStopped", function(event, arg) {
  swal.close();
  swal(config.voiceReply.recordingMessageDone, {
    title: config.voiceReply.recordingMessageTitle,
    buttons: false,
    icon: "success",
    timer: 5000
  });
});

ipcRenderer.on("recordError", function(event, arg) {
  swal.close();
  swal(config.voiceReply.recordingError, {
    title: config.voiceReply.recordingMessageTitle,
    buttons: false,
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
  if (isPaused) hidePause();
  loadImage(true, 0);
  if (isPaused) showPause();
});

ipcRenderer.on("previous", function(event, arg) {
  if (isPaused) hidePause();
  loadImage(false, 0);
  if (isPaused) showPause();
});

ipcRenderer.on("pause", function(event, arg) {
  if (isPaused) return;

  isPaused = true;
  clearTimeout(currentTimeout);
  showPause(isPaused);
});

ipcRenderer.on("play", function(event, arg) {
  if (!isPaused) return;

  isPaused = false;
  loadImage(true, 0);
  hidePause(isPaused);
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

//load imge to slideshow
function loadImage(isNext, fadeTime, goToLatest = false) {
  clearTimeout(currentTimeout);

  if (images.length == 0) {
    currentTimeout = setTimeout(() => {
      loadImage();
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

  logger.info("loading image " + currentImageIndex);
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
        duration: fadeTime,
        complete: function() {
          container.removeChild(currentImage);
        }
      });
      if (!isPaused) {
        currentTimeout = setTimeout(() => {
          loadImage();
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
        duration: fadeTime,
        complete: function() {
          container.removeChild(currentImage);
        }
      });
      if (!isPaused) {
        currentTimeout = setTimeout(() => {
          loadImage();
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
  container.removeChild(currentImage);
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
    swal(" ", {
      title: config.newPhotoMessage + " " + sender,
      buttons: false,
      timer: 5000,
      icon: "success"
    }).then((value) => {
      currentImageIndex = 0;
    });
  } else if (type == "video") {
    swal(" ", {
      title: config.newVideoMessage + " " + sender,
      buttons: false,
      timer: 5000,
      icon: "success"
    }).then((value) => {
      currentImageIndex = 0;
    });
  }
}

//start slideshow of images
loadImage(true, config.fadeTime);
