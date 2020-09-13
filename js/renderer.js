// Imports
const {remote, ipcRenderer, webFrame} = require("electron");
const $ = require("jquery");
window.jQuery = $;
const Swal = require("sweetalert2");
const randomColor = require("randomcolor");
const chroma = require("chroma-js");
const velocity = require("velocity-animate");
const logger = remote.getGlobal("rendererLogger");
const config = remote.getGlobal("config");
const {TouchBar, TouchBarElement} = require("./js/touchBar.js")

// Inform that Renderer started
logger.info("Renderer started ...");


// Create variables
var images = remote.getGlobal("images");
var $container = $('#container');
$container.css('overflow', 'hidden');

var isPaused = false;
var isMuted = false;
var currentImageIndex = images.length;
var currentImageForVoiceReply;
var startTime, endTime, longpress, tapPos, containerWidth, recordSwal, currentTimeout, captionSenderTimeout;
var touchBar;

var touchBarElements = {
  "showNewest": new TouchBarElement("fas fa-history", showNewAssets),
  "previousImage": new TouchBarElement("far fa-arrow-alt-circle-left", previousImage),
  "play": new TouchBarElement("far fa-play-circle", play),
  "pause": new TouchBarElement("far fa-pause-circle", pause),
  "playPause": new TouchBarElement("far fa-pause-circle", playPause),
  "nextImage": new TouchBarElement("far fa-arrow-alt-circle-right", nextImage),
  "record": new TouchBarElement("fas fa-microphone-alt", record),
  "starImage": new TouchBarElement("far fa-star", starImage),
  "deleteImage": new TouchBarElement("far fa-trash-alt", deleteImage),
  "mute": new TouchBarElement("fas fa-volume-up", mute),
  "shutdown": new TouchBarElement("fas fa-power-off", shutdown),
  "reboot": new TouchBarElement("fas fa-redo-alt", reboot),
}

// keep track of shown images per sequence for no repeat in random order
var shownSequence = [];


// configure sound notification sound
if (config.playSoundOnRecieve !== false) {
  var audio = new Audio(__dirname + "/sounds/" + config.playSoundOnRecieve);
}

if (config.touchBar) {
  touchBar = new TouchBar(touchBarElements, config.touchBar)
} else {
  // handle touch events for navigation and voice reply
  $("body").on('touchstart', function() {
    startTime = new Date().getTime();
    currentImageForVoiceReply = images[currentImageIndex]
  });

  $("body").on('touchend', function(event) {
    event.preventDefault();
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
}



// handle pressed record button
ipcRenderer.on("recordButtonPressed", function(event, arg) {
  currentImageForVoiceReply = images[currentImageIndex]
  ipcRenderer.send("record", currentImageForVoiceReply['chatId'], currentImageForVoiceReply['messageId']);
});


// show record in progress message
ipcRenderer.on("recordStarted", function(event, arg) {
  let message = document.createElement("div");
  let spinner = document.createElement("div");
  spinner.classList.add("spinner");
  message.appendChild(spinner);
  let text = document.createElement("p");
  let messageText = config.phrases.recordingPreMessage
                    + ' ' + currentImageForVoiceReply['chatName']
                    + ' ' + config.phrases.recordingPostMessage;
  text.innerHTML = messageText
  message.appendChild(text);
  recordSwal = Swal.fire({
    title: config.phrases.recordingMessageTitle,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    html: message
  });
});

// show record done message
ipcRenderer.on("recordStopped", function(event, arg) {
  let message = document.createElement("div");
  let text = document.createElement("p");
  text.innerHTML = config.phrases.recordingDone
                    + ' ' + currentImageForVoiceReply['chatName'];
  message.appendChild(text);
  recordSwal.close();
  Swal.fire({
    html: message,
    title: config.phrases.recordingMessageTitle,
    showConfirmButton: false,
    icon: "success",
    timer: 5000
  });
});

//show record error message
ipcRenderer.on("recordError", function(event, arg) {
  let message = document.createElement("div");
  let text = document.createElement("p");
  text.innerHTML = config.phrases.recordingError;
  message.appendChild(text);
  recordSwal.close();
  Swal.fire({
    html: message,
    title: config.phrases.recordingMessageTitle,
    showConfirmButton: false,
    icon: "error",
    timer: 5000
  });
});

// handle new incoming image
ipcRenderer.on("newImage", function(event, arg) {
  newImage(arg.sender, arg.type, arg.images);
  if ((config.playSoundOnRecieve != false) && (isMuted == false)) {
    audio.play();
  }
});

// handle navigation
ipcRenderer.on('next', function(event, arg) {
  nextImage(arg)
});

ipcRenderer.on('previous', function(event, arg) {
  previousImage(arg)
});

ipcRenderer.on('pause', function(event, arg) {
  pause()
});

ipcRenderer.on('play', function(event, arg) {
  play()
});

ipcRenderer.on('playPause', function(event, arg) {
  playPause()
});

ipcRenderer.on('newest', function(event, arg) {
  showNewAssets()
});

ipcRenderer.on('delete', function(event, arg) {
  deleteImage()
});

ipcRenderer.on('star', function(event, arg) {
  starImage()
});

ipcRenderer.on('mute', function(event, arg) {
  mute()
});

ipcRenderer.on('reboot', function(event, arg) {
  reboot()
});

ipcRenderer.on('shutdown', function(event, arg) {
  shutdown()
});

ipcRenderer.on('askConfirm', function(event, arg) {
  $('.swal2-confirm').trigger('click');
});

ipcRenderer.on('askCancel', function(event, arg) {
  $('.swal2-cancel').trigger('click');
});

ipcRenderer.on('messageBox', function(event, arg) {
  if (typeof arg === 'object' && !Array.isArray(arg) && (arg.title || arg.html)) {
    Swal.fire(Object.assign({
      showConfirmButton: false,
      timer: 5000,
      // icon: 'success'
    }, arg));
  } else {
    logger.warn(`Ignored event 'messageBox'! <arg> is not an object.`);
  }
});

ipcRenderer.on('reloadRenderer', function(event, arg) {
  remote.getCurrentWindow().reload();
});

ipcRenderer.on('imagesUpdated', function(event, arg) {
  let validArg = (Array.isArray(arg) && (arg.length === 0 || arg[0].src));
  if (validArg) {
    images = arg;
  } else {
    logger.warn(`Ignored invalid argument for Event 'imagesUpdated'!`);
  }
});


// functions to show and hide pause icon
function showPause() {
  if ($('#pauseBox').length > 0)
  {
    $container.append($('#pauseBox').detach());
  } else {
    var $pauseBox = $('<div id="pauseBox"/>');
    $pauseBox.css({
      height :'50px',
      width: '45px',
      position: 'absolute',
      top: '20px',
      right: '20px'
    });

    var $divBar = $("<div/>");
    $divBar.css({
      height: '50px',
      'width': '15px',
      'background-color': 'blue',
      float: 'left',
      'border-radius': '2px'
    });

    $pauseBox.append($divBar, $divBar.clone().css({
      float: 'right',
      'border-radius': '2px'
    }));

    $container.append($pauseBox);
  }
}

function hidePause() {
  $("#pauseBox").remove();
}

// functions for navigation
function nextImage(fadeTime) {
  loadImage(true, (fadeTime || 0));
  if (isPaused) showPause();
}

function previousImage(fadeTime) {
  loadImage(false, (fadeTime || 0));
  if (isPaused) showPause();
}

function pause() {
  if (isPaused) return;

  isPaused = true;
  clearTimeout(currentTimeout);
  showPause();
  setTouchbarIconStatus();
  ipcRenderer.send("paused", isPaused);
}

function play() {
  if (!isPaused) return;

  isPaused = false;
  loadImage(true, 0);
  hidePause();
  setTouchbarIconStatus();
  ipcRenderer.send("paused", isPaused);
}

function playPause() {
  if (isPaused) {
    play()
  } else {
    pause()
  }
}

function record() {
  if (images.length == 0) {
    return;
  }
  currentImageForVoiceReply = images[currentImageIndex]
  ipcRenderer.send("record", currentImageForVoiceReply['chatId'], currentImageForVoiceReply['messageId']);
}

function starImage() {
  if (images.length == 0) {
    return;
  }
  if (images[currentImageIndex].starred) {
    images[currentImageIndex].starred = false
    ipcRenderer.send("unstarImage", currentImageIndex);
  } else {
    images[currentImageIndex].starred = true
    ipcRenderer.send("starImage", currentImageIndex);
  }
  setTouchbarIconStatus();
}

function deleteImage() {
  if (images.length == 0) {
    return;
  }
  // to ensure to show the correctly next image
  const doDeleteImage =  () => {
    ipcRenderer.send("deleteImage", currentImageIndex);
    images.splice(currentImageIndex, 1)
    if (images.length == 0) {
      $container.empty();
      $container.append('<h1>TeleFrame</h1>');
    }
    currentImageIndex = (currentImageIndex > 0 ? currentImageIndex - 1 : images.length);
  };
  if (config.confirmDeleteImage === false) {
    doDeleteImage();
    return;
  }
  var paused = isPaused;
  pause();
  touchBar.hide();
  Swal.fire({
    title: config.phrases.deleteMessage,
    background: 'rgba(255,255,255,0.8)',
    confirmButtonText: config.phrases.deleteConfirmText,
    cancelButtonText: config.phrases.deleteCancelText,
    showCancelButton: true,
    focusCancel: true,
    confirmButtonColor: '#a00',
    icon: "warning"
  }).then(result => {
    if (result.value) {
      doDeleteImage();
    } else {
      currentImageIndex = (currentImageIndex > 0 ? currentImageIndex - 1 : images.length);
    }
    if (!paused) {
      play();
    } else {
      loadImage(true, 0);
    }
    touchBar.show();
  });
}

function mute() {
  if (isMuted) {
    $('.mute > i').removeClass('fa-volume-mute').addClass('fa-volume-up');
  } else {
    $('.mute > i').removeClass('fa-volume-up').addClass('fa-volume-mute');
  }
  isMuted = !isMuted;
  ipcRenderer.send("muted", isMuted);
}

function shutdown() {
  const doShutdown = () => executeSystemCommand("sudo shutdown -h now");

  if (config.confirmShutdown === false) {
     doShutdown();
    return;
  }
  touchBar.hide();
  Swal.fire({
    title: config.phrases.shutdownMessage,
    background: 'rgba(255,255,255,0.8)',
    confirmButtonText: config.phrases.shutdownConfirmText,
    cancelButtonText: config.phrases.shutdownCancelText,
    showCancelButton: true,
    focusCancel: true,
    confirmButtonColor: '#a00',
    icon: "warning"
  }).then(result => {
    if (result.value) {
       doShutdown();
    } else {
      touchBar.show();
    }
  });
}

function reboot() {
  const doReboot = () => executeSystemCommand("sudo reboot");

  if (config.confirmReboot === false) {
     doReboot();
    return;
  }
  touchBar.hide();
  Swal.fire({
    title: config.phrases.rebootMessage,
    background: 'rgba(255,255,255,0.8)',
    confirmButtonText: config.phrases.rebootConfirmText,
    cancelButtonText: config.phrases.rebootCancelText,
    showCancelButton: true,
    focusCancel: true,
    confirmButtonColor: '#a00',
    icon: "warning"
  }).then(result => {
    if (result.value) {
       doReboot();
    } else {
      touchBar.show();
    }
  });
}

function showNewAssets() {
  clearTimeout(currentTimeout);
  if (images.findIndex(e => e.unseen) > -1) {
    $('.showNewest >  i').removeClass('new-asset fa-image fa-images').addClass('fa-history');
    for (let i = 0; i < images.length; i++) {
      if(images[i].unseen) {
        delete images[i].unseen;
      } else {
        break;
      }
    }
    ipcRenderer.send("removeImageUnseen");
  }
  loadImage(false, 0, true);
}

function setTouchbarIconStatus() {
  if (images.length > 0) {
    if (images[currentImageIndex].starred) {
      $('.starImage > i').removeClass('far').addClass('fas');
    } else {
      $('.starImage > i').removeClass('fas').addClass('far');
    }
    if (isPaused) {
      $('.playPause > i').removeClass('fa-play-circle').addClass('fa-pause-circle');
    } else {
      $('.playPause > i').removeClass('fa-pause-circle').addClass('fa-play-circle');
    }
    $('.record, .deleteImage, .starImage').find('i').removeClass('disabled-icon');
    if (images[0].unseen) {
      $('.showNewest > i').removeClass('fa-history fa-images').addClass('fa-image new-asset');
    } else {
      $('.showNewest > i').removeClass('fa-image fa-images new-asset').addClass('fa-history');
    }
  }
  if (images.length > 1) {
    $('.previousImage, .nextImage, .showNewest, .playPause').find('i').removeClass('disabled-icon');
    if (images[1].unseen) {
      $('.showNewest > i').removeClass('fa-image').addClass('fa-images');
    }
  }
  if (images.length < 2) {
    $('.playPause, .previousImage, .nextImage').find('i').addClass('disabled-icon');
    $('.showNewest > i').removeClass('new-asset fa-image fa-images').addClass('fa-history disabled-icon')
    if (images.length == 0) {
      $('.record, .deleteImage, .starImage').find('i').addClass('disabled-icon');
    }
  }
}

function executeSystemCommand(command) {
  ipcRenderer.send("executeSystemCommand", command);
}

function dummyCallback() {
  Swal.fire({
    html: "This is not yet implemented",
    title: "Ooops",
    showConfirmButton: false,
    icon: "error",
    timer: 5000
  });
}

/**
 * Create the caption and sender containers
 * @param  {Object} image    entry of images array
 */
$.fn.createCaptionSender = function(image) {
  let $assetDiv = $(this);
  clearTimeout(captionSenderTimeout);
  if (config.showCaption || config.showSender) {
    var $sender = $('<span class="sender"/>');
    var $caption = $('<span class="caption"/>');

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

    $sender.html(image.sender);
    $caption.html(image.caption);
    $([$sender, $caption]).each(function() {
      $(this).css({
        backgroundColor: backgroundColor,
        color: fontColor
      });
    });

    //generate some randomness for positions of sender and caption
    if (Math.random() >= 0.5) {
      $sender.css({
        left: 0,
        'border-top-right-radius': "10px",
        'border-bottom-right-radius': "10px"
      });
    } else {
      $sender.css({
        right: 0,
        'border-top-left-radius': "10px",
        'border-bottom-left-radius': "10px"
      });
    }
    if (Math.random() >= 0.5) {
      $caption.css({
        left: 0,
        'border-top-right-radius': "10px",
        'border-bottom-right-radius': "10px"
      });
    } else {
      $caption.css({
        right: 0,
        'border-top-left-radius': "10px",
        'border-bottom-left-radius': "10px"
      });
    }
    if (Math.random() >= 0.5) {
      $sender.css('top', "2%");
      $caption.css('bottom', "2%");
    } else {
      $sender.css('bottom', "2%");
      $caption.css('top', "2%");
    }
    if (config.showSender) {
      $assetDiv.append($sender);
    }
    if (config.showCaption && image.caption !== undefined) {
      $assetDiv.append($caption);
    }
    //fade out sender and caption at half time of the shown image
    captionSenderTimeout = setTimeout(() => {
      $('.sender, .caption').each(function() {
        $(this).velocity("fadeOut", {
          duration: config.fadeTime / 2,
          complete: function() { $(this).remove(); }
        });
      });
    }, config.interval * 0.01 * (Math.max(10, Math.min(100, parseInt(config.senderAndCaptionDuration) || 50))));
  }
};

//load image to slideshow
function loadImage(isNext, fadeTime, goToLatest = false) {
  clearTimeout(currentTimeout);

  if (images.length == 0) {
    currentTimeout = setTimeout(() => {
      loadImage(true, fadeTime);
    }, config.interval);
    return;
  }

  // get image path and increase currentImageIndex for next image

  if (goToLatest) {
    currentImageIndex = 0;
  } else if (isNext) {
    if (!config.randomOrder) {
    // select next picture
        if (currentImageIndex >= images.length - 1) {
          currentImageIndex = 0;
        } else {
          currentImageIndex++;
        }
    } else {
    // select random picture
        if (shownSequence.length >= images.length) {
            shownSequence = [];
        }
        do {
            next = Math.floor(Math.random() * images.length);
        } while  (shownSequence.includes(next));
        shownSequence.push(next);
        currentImageIndex = next;
    }
  } else {
    currentImageIndex--;
    if (currentImageIndex < 0) currentImageIndex = images.length - 1;
  }

  var image = images[currentImageIndex];
  setTouchbarIconStatus();
  ipcRenderer.send('changingActiveImage', currentImageIndex, fadeTime);

  //get current container and create needed elements
  var $currentImage = $container.children('div.basecontainer, div.imgcontainer, h1').first();

  // create asset container
  var $div = $('<div class="imgcontainer"/>');
  var $assetDiv = null;
  if (config.useFullscreenForCaptionAndSender) {
    // Create an additional container to display sender/caption on the full screen
    $assetDiv = $("<div/>");
    $assetDiv.addClass("basecontainer");
    $assetDiv.append($div);
    $assetDiv.css({
      display: 'none',
    });
    $div.css('display', 'block');
  } else {
    $assetDiv = $div;
  }

  // create asset container
  var $asset;
  if (image.src.split(".").pop() == "mp4") {
    $asset = $("<video/>");
    $asset.prop('muted',  !config.playVideoAudio);
    $asset.prop('autoplay', true);
  } else {
    $asset = $("<img/>");
  }
  $asset.attr('src', image.src);
  $asset.addClass("image");

  $div.append($asset);

  $container.append($assetDiv);

  $asset.one(($asset.is('video') ? 'loadeddata' : 'load'), {currentAsset: $currentImage},
  function(event) {
    let $currentAsset = event.data.currentAsset;
    delete event.data.currentAsset;
    let $asset = $(this);
    let $assetDiv = $asset.parents('.basecontainer, .imgcontainer').last();
    const screenAspectRatio = remote
        .getCurrentWindow()
        .webContents.getOwnerBrowserWindow()
        .getBounds().width /
        remote
        .getCurrentWindow()
        .webContents.getOwnerBrowserWindow()
        .getBounds().height;

    const assetAspectRatio = ($asset.is('video')
        ? $asset.videoWidth / $asset.videoHeight
        : $asset.naturalWidth / $asset.naturalHeight);

    //calculate aspect ratio to show complete image on the screen and
    //fade in new image while fading out the old image as soon as
    //the new image is loaded
    let css;

    if (config.cropZoomImages) {
      // zoom to the max, no borders
      if (assetAspectRatio > screenAspectRatio) {
          css = { height: "100%" };
      } else {
          css = { width: "100%" };
      }
    } else {
      // show complete image, has borders if ratios don't match
      if (assetAspectRatio > screenAspectRatio) {
          css = { width: "100%" };
      } else {
          css = { height: "100%" };
      }
    }

    $([$asset, $asset.closest('.imgcontainer')]).each( function(){
        $(this).css(css);
    });

    $assetDiv.createCaptionSender(image);

    if (fadeTime === 0) {
      $assetDiv.show();
      $currentAsset.remove();
      cleanUp();
    } else {
      $assetDiv.velocity("fadeIn", {
        duration: fadeTime
      });
      $currentAsset.velocity("fadeOut", {
        duration: fadeTime,
        complete: function() {
          $(this).remove();
          cleanUp();
        }
      });
    }

    if (!isPaused && images.length > 1) {
      currentTimeout = setTimeout(() => {
        loadImage(true, config.fadeTime);
      }, ($asset.is('video') ? $asset.prop('duration') * 1000 : config.interval));
    }

    ipcRenderer.send('changedActiveImage', currentImageIndex);
  });
}

const cleanUp = () => {
  const cleanUpSelector = (config.useFullscreenForCaptionAndSender
   ? 'div.basecontainer'
   : 'div.imgcontainer') + ', h1';
  // console.log('Cleanup element count to be removed now:',
  //  $container.children(removeSelector).not(':last').length,
  //  'all containers:', ($container.find(removeSelector).length));
  $container.children(cleanUpSelector).not(':last').remove();
  webFrame.clearCache();
}

//notify user of incoming image and restart slideshow with the newest image
function newImage(sender, type, newImageArray) {
  images = newImageArray;
  setTouchbarIconStatus();
  clearTimeout(currentTimeout);

  let message;
  if (type == 'image') {
    message = config.phrases.newPhotoMessage;
  } else {
    message = config.phrases.newVideoMessage;
  }
  Swal.fire({
    title: message
          + " " + sender,
    showConfirmButton: false,
    timer: 5000,
    icon: "success"
  }).then((value) => {
    currentImageIndex = 0;
    loadImage(false, 0, true);
  });
}

ipcRenderer.send('renderer-ready');
//start slideshow of images
loadImage(true, config.fadeTime);
