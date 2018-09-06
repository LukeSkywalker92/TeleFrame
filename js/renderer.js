const {
  remote
} = require('electron');
const logger = remote.getGlobal('rendererLogger');
const config = remote.getGlobal('config');
const $ = require('jquery')

logger.info('Renderer started ...')

var images = remote.getGlobal('images')
var container = document.getElementById('container');

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
    $(img).fadeOut(0);
    $(img).fadeIn(config.fadeTime);
    $(currentImage).fadeOut(config.fadeTime, function() {
      container.removeChild(currentImage);
    });
  }
  container.appendChild(img);

}
