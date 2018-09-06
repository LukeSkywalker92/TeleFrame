const {
  remote,
  ipcRenderer
} = require('electron');
const $ = require('jquery')
const swal = require('sweetalert')
const logger = remote.getGlobal('rendererLogger');
const config = remote.getGlobal('config');

logger.info('Renderer started ...')

var images = remote.getGlobal('images')
var container = document.getElementById('container');

ipcRenderer.on('newImage', function(event, arg) {
  newImage(arg.sender)
});


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

function loadImage(src) {
  var currentImage = container.firstElementChild;
  var img = document.createElement('img');
  img.src = src;
  img.className = 'image';
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
