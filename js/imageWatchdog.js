const testFolder = './tests/';
const fs = require('fs');



var ImageWatchdog = class {
  constructor(imageFolder, imageCount, images, emitter, logger) {
    this.imageFolder = imageFolder;
    this.imageCount = imageCount;
    this.images = images;
    this.logger = logger;
    this.emitter = emitter;

    //get paths of already downloaded images
    fs.readdir(this.imageFolder, (err, files) => {
      for (var i = 0; i < this.imageCount; i++) {
        this.images.push(this.imageFolder + '/' + files.pop())
      }
    })
  }

  newImage(src, sender) {
    //handle new incoming image
    this.images.unshift(src);
    this.images.pop();
    //notify frontend, that new image arrived
    this.emitter.send('newImage', {
      sender: sender
    });
  }

}

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = ImageWatchdog;
}
