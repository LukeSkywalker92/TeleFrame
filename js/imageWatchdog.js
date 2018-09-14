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

    fs.readFile(this.imageFolder + '/' + "images.json", (err, data) => {
      if (err) throw err;
      this.images = JSON.parse(data);
      console.log(this.images);
    });


/*    fs.readdir(this.imageFolder, (err, files) => {
      var numberOfFiles = this.imageCount;
      if (files.length < numberOfFiles) {
        numberOfFiles = files.length;
      }
      for (var i = 0; i < numberOfFiles; i++) {
        this.images.push({
          'src': this.imageFolder + '/' + files.pop(),
          'sender': '',
          'caption': ''
        })
      }
    }) */
  }

  newImage(src, sender, caption) {
    //handle new incoming image
    this.images.unshift({
      'src': src,
      'sender': sender,
      'caption': caption
    });
    if (this.images.length >= this.imageCount) {
      this.images.pop();
    }
    //notify frontend, that new image arrived
    this.emitter.send('newImage', {
      sender: sender
    });
    this.saveImageArray();
  }

  saveImageArray() {
    // stringify JSON Object
    var jsonContent = JSON.stringify(this.images);
    console.log(jsonContent);

    fs.writeFile(this.imageFolder + '/' + "images.json", jsonContent, 'utf8', function(err) {
      if (err) {
        this.logger.error("An error occured while writing JSON Object to File.");
        return console.log(err);
      }
      this.logger.info("JSON file has been saved.");
    });
  }

}

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = ImageWatchdog;
}
