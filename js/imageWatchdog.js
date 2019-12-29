const fs = require('fs');

var ImageWatchdog = class {
  constructor(imageFolder, imageCount, autoDeleteImages, images, emitter, logger, ipcMain) {
    this.imageFolder = imageFolder;
    this.imageCount = imageCount;
    this.autoDeleteImages = autoDeleteImages;
    this.images = images;
    this.logger = logger;
    this.emitter = emitter;
    this.ipcMain = ipcMain;


    //get paths of already downloaded images
    if (fs.existsSync(this.imageFolder + '/' + "images.json")) {
      fs.readFile(this.imageFolder + '/' + "images.json", (err, data) => {
        if (err) throw err;
        var jsonData = JSON.parse(data);
        for (var image in jsonData) {
      	  if (fs.existsSync(jsonData[image].src)) {
      	    const stats = fs.statSync(jsonData[image].src);
      	    if (stats.size > 0) {
              this.images.push(jsonData[image]);
              if (jsonData[image].starred) {
                console.log("starred")
                this.imageCount++;
              }
            }
          }
        }
      });

    } else {
      this.saveImageArray()
    }
  }



  init() {

    this.ipcMain.on('starImage', (event, images) => {
      this.imageCount++;
      this.images = images;
      this.saveImageArray();
    })

    this.ipcMain.on('unstarImage', (event, images) => {
      this.imageCount--;
      this.images = images;
      this.saveImageArray();
    })

    this.ipcMain.on('deleteImage', (event, index) => {
      if (this.images[index].starred) {
        this.imageCount--;
      }
      this.autoDeleteImage(index);
      this.images.splice(index, 1)
      this.saveImageArray();
    })
  }

  autoDeleteImage(idx2bedeleted) {
    if (this.autoDeleteImages) {
      try {
          var oldSrc = this.images[idx2bedeleted].src;
          fs.unlinkSync(oldSrc);
          this.logger.info("Deleted file " + oldSrc);
      } catch(err) {
          this.logger.error('An error occured while deleting the file ' + oldSrc + ':\n' + err);
      }
    }
  }

  newImage(src, sender, caption, chatId, chatName, messageId) {
    //handle new incoming image
    // TODO: message ID and chat name to reply to specific image and to show
    //         chat name for voice recording message
    this.images.unshift({
      'src': src,
      'sender': sender,
      'caption': caption,
      'chatId': chatId,
      'chatName': chatName,
      'messageId': messageId
    });

    console.log(this.imageCount);
    while (this.images.length > this.imageCount) {
      console.log("yay");
      var idx2bedeleted = this.getOldestUnstarredImageIndex();
      this.autoDeleteImage(idx2bedeleted);
      console.log(this.images.splice(idx2bedeleted, 1));
    }
    console.log(this.images.length);
    console.log(this.imageCount);
    //notify frontend, that new image arrived
    var type;
    if (src.split('.').pop() == 'mp4') {
      type = 'video';
    } else {
      type = 'image';
    }
    this.emitter.send('newImage', {
      sender: sender,
      type: type,
      images: this.images
    });
    this.saveImageArray();
  }

  getOldestUnstarredImageIndex() {
    for (var i = this.images.length-1; i > 0; i--) {
      console.log(i);
      console.log(!this.images[i].starred);
       if (!this.images[i].starred) {
         console.log(i);
         return i;
       }
    }
  }

  saveImageArray() {
    var self = this;
    // stringify JSON Object
    var jsonContent = JSON.stringify(this.images);
    fs.writeFile(this.imageFolder + '/' + "images.json", jsonContent, 'utf8', function(err) {
      if (err) {
        this.logger.error("An error occured while writing JSON Object to File.");
        return console.log(err);
      }
    });
  }

}

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = ImageWatchdog;
}
