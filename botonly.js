/*
Script for only running the telegram bot to save the images and videos to
the images folder specified in the config
*/

const {
  logger,
  rendererLogger
} = require('./js/logger')
const {config} = require('./js/configuration')
const telebot = require('./js/bot')
const fs = require('fs');

if (config.botToken === 'bot-disabled') {
  logger.error('Error running bot only version of TeleFrame! No valid botToken is configured.');
  return;
}


logger.info('Running bot only version of TeleFrame ...');


var ImageWatchdog = class {
  constructor(imageFolder, imageCount, autoDeleteImages, logger) {
    this.imageFolder = imageFolder;
    this.imageCount = imageCount;
    this.autoDeleteImages = autoDeleteImages;
    this.logger = logger;
    this.images = []

    console.log("")

    //get paths of already downloaded images
    if (fs.existsSync(this.imageFolder + '/' + "images.json")) {
      fs.readFile(this.imageFolder + '/' + "images.json", (err, data) => {
        if (err) throw err;
        var jsonData = JSON.parse(data);
        for (var image in jsonData) {
          this.images.push(jsonData[image]);
        }
        if (this.images.length >= this.imageCount) {
          while (this.images.length > this.imageCount) {
            //console.log("yay");
            var idx2bedeleted = this.getOldestUnstarredImageIndex();
            this.autoDeleteImage(idx2bedeleted);
            //console.log(this.images.splice(idx2bedeleted, 1));
            this.images.splice(idx2bedeleted, 1);
          }
          this.saveImageArray()
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
      while (this.images.length > this.imageCount) {
        //console.log("yay");
        var idx2bedeleted = this.getOldestUnstarredImageIndex();
        this.autoDeleteImage(idx2bedeleted);
        //console.log(this.images.splice(idx2bedeleted, 1));
        this.images.splice(idx2bedeleted, 1);
      }
    }
    var type;
    if (src.split('.').pop() == 'mp4') {
      type = 'video';
    } else {
      type = 'image';
    }
    this.saveImageArray();
  }

  getOldestUnstarredImageIndex() {
    for (var i = this.images.length-1; i > 0; i--) {
      //console.log(!this.images[i].starred);
       if (!this.images[i].starred) {
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
        self.logger.error("An error occured while writing JSON Object to File.");
        return console.log(err);
      }
    });
  }

  autoDeleteImage(idx2bedeleted) {
    var self = this;
    if (self.autoDeleteImages) {
      try {
          var oldSrc = this.images[idx2bedeleted].src;
          fs.unlinkSync(oldSrc);
          self.logger.info("Deleted file " + oldSrc);
      } catch(err) {
          self.logger.error('An error occured while deleting the file ' + oldSrc + ':\n' + err);
      }
    }
  }

}

// create imageWatchdog and bot
const imageWatchdog = new ImageWatchdog(config.imageFolder, config.imageCount, config.autoDeleteImages, logger);
var bot = new telebot(imageWatchdog, logger, config);

bot.startBot()
