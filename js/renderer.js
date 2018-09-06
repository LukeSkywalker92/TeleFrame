const {
  remote
} = require('electron');
const logger = remote.getGlobal('rendererLogger');
const $ = require('jquery')

console.log($);

logger.info('Renderer started ...')

var container = document.getElementById('container');

loadImage('1536172841515.jpg');

function loadImage(src) {
  container.removeChild(container.firstChild);
  var helperImage = new Image();
  var img = document.createElement('img');
  helperImage.src = src;
  img.src = src;
  img.className = 'image';
  if (helperImage.width > helperImage.height) {
    img.style.width = "100%";
  } else {
    img.style.height = "100%";
  }
  container.appendChild(img);
}



function resizeToMax(id) {
  myImage = new Image()
  var img = document.getElementById(id);
  myImage.src = img.src;
  if (myImage.width > myImage.height) {
    img.style.width = "100%";
  } else {
    img.style.height = "100%";
  }
}
