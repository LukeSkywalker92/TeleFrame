const {
  remote,
  ipcRenderer
} = require('electron');
const $ = require('jquery')
const swal = require('sweetalert')
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
    imagepath = images[i].src;
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
function loadImage(src) {
  var currentImage = container.firstElementChild;
  var img = document.createElement('img');
  img.src = src;
  img.className = 'image';

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
    } else {
      img.style.height = "100%";
    }
    $(img).fadeIn(config.fadeTime);
    $(currentImage).fadeOut(config.fadeTime, function() {
      container.removeChild(currentImage);
    });
  }
  container.appendChild(img);

}
