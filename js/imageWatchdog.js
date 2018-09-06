const testFolder = './tests/';
const fs = require('fs');



var ImageWatchdog = class {
  constructor (imageFolder, images, logger) {
    this.imageFolder = imageFolder;
    this.images = images;
    this.logger = logger;

    fs.readdir(this.imageFolder, (err, files) => {
      files.forEach(file => {
        this.images.unshift(this.imageFolder+'/'+file)
        this.logger.info(images);
      });
    })
  }
}

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = ImageWatchdog;}
