const {
  remote,
  ipcRenderer
} = require('electron');
const $ = require('jquery');
const swal = require('sweetalert');
const randomColor = require('randomcolor');
const chroma = require('chroma-js');
const logger = remote.getGlobal('rendererLogger');
const config = remote.getGlobal('config');

logger.info('Renderer started ...')

var images = remote.getGlobal('images');
var container = document.getElementById('container');

//handle new incoming image
ipcRenderer.on('newImage', function(event, arg) {
  newImage(arg.sender)
});

//start slideshow of images
var i = 0;
setInterval(function() {
  if (images.length == 0) {} else {
    imagepath = images[i];
    loadImage(imagepath)
    if (i >= images.length - 1) {
      i = 0;
    } else {
      i++;
    }
  }
}, config.interval)

//notify user of incoming image and restart slideshow with the newest image
function newImage(sender) {
  images = remote.getGlobal('images');
  swal(' ', {
    title: config.newPhotoMessage + ' ' + sender,
    buttons: false,
    timer: 5000,
    icon: "success"
  }).then((value) => {
    i = 0;
  });
}

//load imge to slideshow
function loadImage(image) {
  //get current container and create needed elements
  var currentImage = container.firstElementChild;
  var div = document.createElement('div');
  var img = document.createElement('img');
  var sender = document.createElement('span');
  var caption = document.createElement('span');

  //create background and font colors for sender and caption
  var backgroundColor = randomColor({
    luminosity: 'dark',
    alpha: 1
  });
  var fontColor = randomColor({
    luminosity: 'light',
    alpha: 1
  });
  //when contrast between background color and font color is too small to
  //make the text readable, recreate colors
  while (chroma.contrast(backgroundColor, fontColor) < 4.5) {
    backgroundColor = randomColor({
      luminosity: 'dark',
      alpha: 1
    });
    fontColor = randomColor({
      luminosity: 'light',
      alpha: 1
    });
  }

  //set class names and style attributes
  img.src = image.src;
  img.className = 'image';
  div.className = 'imgcontainer';
  sender.className = 'sender';
  caption.className = 'caption';
  caption.id = 'caption';
  sender.innerHTML = image.sender;
  caption.innerHTML = image.caption;
  sender.style.backgroundColor = backgroundColor;
  caption.style.backgroundColor = backgroundColor;
  sender.style.color = fontColor;
  caption.style.color = fontColor;

  //generate some randomness for positions of sender and caption
  if (Math.random() >= 0.5) {
    sender.style.left = 0;
    sender.style.borderTopRightRadius = '10px';
    sender.style.borderBottomRightRadius = '10px';
  } else {
    sender.style.right = 0;
    sender.style.borderTopLeftRadius = '10px';
    sender.style.borderBottomLeftRadius = '10px';
  }
  if (Math.random() >= 0.5) {
    caption.style.left = 0;
    caption.style.borderTopRightRadius = '10px';
    caption.style.borderBottomRightRadius = '10px';
  } else {
    caption.style.right = 0;
    caption.style.borderTopLeftRadius = '10px';
    caption.style.borderBottomLeftRadius = '10px';
  }
  if (Math.random() >= 0.5) {
    sender.style.top = '2%';
    caption.style.bottom = '2%';
  } else {
    sender.style.bottom = '2%';
    caption.style.top = '2%';
  }

  //calculate aspect ratio to show complete image on the screen and
  //fade in new image while fading out the old image as soon as
  //the new imageis loaded
  img.onload = function() {
    screenAspectRatio = remote.getCurrentWindow().webContents
      .getOwnerBrowserWindow().getBounds().width / remote.getCurrentWindow()
      .webContents.getOwnerBrowserWindow().getBounds().height;
    imageAspectRatio = img.naturalWidth / img.naturalHeight;
    if (imageAspectRatio > screenAspectRatio) {
      img.style.width = "100%";
      div.style.width = "100%";
    } else {
      img.style.height = "100%";
      div.style.height = "100%";
    }
    $(div).fadeIn(config.fadeTime);
    $(currentImage).fadeOut(config.fadeTime, function() {
      container.removeChild(currentImage);
    });
  }
  div.appendChild(img);
  if (config.showSender) {
    div.appendChild(sender);
  }
  if (config.showCaption && image.caption !== undefined) {
    div.appendChild(caption);
  }
  container.appendChild(div);

  //fade out sender and caption at half time of the shown image
  setTimeout(function() {
    $(sender).fadeOut(config.fadeTime / 2)
    $(caption).fadeOut(config.fadeTime / 2)
  }, config.interval / 2);

}
