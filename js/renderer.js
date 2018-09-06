const {remote} = require('electron');
const logger = remote.getGlobal('rendererLogger');
const config = remote.getGlobal('config');
const $ = require('jquery')

console.log()

logger.info('Renderer started ...')

var container = document.getElementById('container');

setTimeout(function() {
  loadImage('1536172841515.jpg');
}, config.interval);

setTimeout(function() {
  loadImage('1536235826291.jpg');
}, config.interval * 2);




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
