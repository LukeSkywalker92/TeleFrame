const testFolder = './tests/';
const fs = require('fs');



var ImageWatchdog = class {
  constructor (imageFolder, imageCount, images, emitter, logger) {
    this.imageFolder = imageFolder;
    this.imageCount = imageCount;
    this.images = images;
    this.logger = logger;
    this.emitter = emitter;

    fs.readdir(this.imageFolder, (err, files) => {
      for (var i = 0; i < this.imageCount; i++) {
        this.images.push(this.imageFolder+'/'+files.pop())
      }
    })
  }

  newImage(src, sender) {
    this.images.unshift(src);
    this.images.pop();
    this.emitter.send('newImage', {sender: sender});
  }

}

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = ImageWatchdog;}
