const {
  remote,
  ipcRenderer
} = require('electron');
const $ = require('jquery');
const swal = require('sweetalert');
const randomColor = require('randomcolor');
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
  var currentImage = container.firstElementChild;
  var div = document.createElement('div');
  var img = document.createElement('img');
  var sender = document.createElement('span');
  var caption = document.createElement('span');
  var backgroundColor = randomColor({
    luminosity: 'bright',
    alpha: 1
  });
  var fontColor = randomColor({
    luminosity: 'light',
    alpha: 1
  });
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

  setTimeout(function() {
    $(sender).fadeOut(config.fadeTime / 2)
    $(caption).fadeOut(config.fadeTime / 2)
  }, config.interval / 2);

}
