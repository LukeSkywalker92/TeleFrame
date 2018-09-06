const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')
const download = require('image-downloader')
const moment = require('moment');

var Bot = class {
  constructor(botToken, app, logger) {
    this.bot = new Telegraf(botToken)
    this.telegram = new Telegram(botToken)
    this.logger = logger

    //Welcome message on bot start
    this.bot.start((ctx) => ctx.reply('Welcome'))

    //Help message
    this.bot.help((ctx) => ctx.reply('Send me an image.'))

    //Download incoming photo
    this.bot.on('photo', (ctx) => {
      this.telegram.getFileLink(ctx.message.photo[ctx.message.photo.length - 1].file_id).then(
        link => {
          logger.info(link);
          download.image({
              url: link,
              dest: moment().format('x') + '.jpg' // Save to /path/to/dest/photo.jpg
            })
            .then(({
              filename,
              image
            }) => {
              this.logger.info('File saved to', filename)
            })
            .catch((err) => {
              this.logger.error(err)
            })
        }
      )
    });

    //Some small conversation
    this.bot.hears('hi', (ctx) => ctx.reply('Hey there'))

    this.logger.info('Bot created!')
  }

  startBot() {
    //Start bot
    this.bot.startPolling()
    this.logger.info('Bot started!')
  }


}

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = Bot;}
