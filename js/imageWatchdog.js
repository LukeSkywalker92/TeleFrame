const fs = require('fs');

var ImageWatchdog = class {
  constructor(imageFolder, imageCount, images, emitter, logger) {
    this.imageFolder = imageFolder;
    this.imageCount = imageCount;
    this.images = images;
    this.logger = logger;
    this.emitter = emitter;

    //get paths of already downloaded images
    if (fs.existsSync(this.imageFolder + '/' + "images.json")) {
      fs.readFile(this.imageFolder + '/' + "images.json", (err, data) => {
        if (err) throw err;
        var jsonData = JSON.parse(data);
        for (var image in jsonData) {
          this.images.push(jsonData[image]);
        }
      });
    } else {
      this.saveImageArray()
    }
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
		var type;
		if (src.split('.').pop() == 'mp4') {
			type = 'video';
		} else {
			type = 'image';
		}
    this.emitter.send('newImage', {
      sender: sender,
			type: type
    });
    this.saveImageArray();
  }

  saveImageArray() {
    var self = this;
    // stringify JSON Object
    var jsonContent = JSON.stringify(this.images);
    fs.writeFile(this.imageFolder + '/' + "images.json", jsonContent, 'utf8', function(err) {
      if (err) {
        self.logger.error("An error occured while writing JSON Object to File.");
        return console.log(err);
      }
    });
  }

}

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = ImageWatchdog;
}
