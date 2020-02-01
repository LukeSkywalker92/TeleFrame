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
  constructor(imageFolder, imageCount, logger) {
    this.imageFolder = imageFolder;
    this.imageCount = imageCount;
    this.logger = logger;
    this.images = []

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
    var type;
    if (src.split('.').pop() == 'mp4') {
      type = 'video';
    } else {
      type = 'image';
    }
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

// create imageWatchdog and bot
const imageWatchdog = new ImageWatchdog(config.imageFolder, config.imageCount, logger);
var bot = new telebot(imageWatchdog, logger, config);

bot.startBot()
