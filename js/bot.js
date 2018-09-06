require('dotenv').load();
const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')
const download = require('image-downloader')
const moment = require('moment');


const bot = new Telegraf(process.env.BOT_TOKEN)
const telegram = new Telegram(process.env.BOT_TOKEN)

//Welcome message on bot start
bot.start((ctx) => ctx.reply('Welcome'))

//Help message
bot.help((ctx) => ctx.reply('Send me an image.'))

//Download incoming photo
bot.on('photo', (ctx) => {
  telegram.getFileLink(ctx.message.photo[ctx.message.photo.length - 1].file_id).then(
    link => {
      console.log(link);
      download.image({
          url: link,
          dest: moment().format('x') + '.jpg' // Save to /path/to/dest/photo.jpg
        })
        .then(({
          filename,
          image
        }) => {
          console.log('File saved to', filename)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  )
});

//Some small conversation
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

//Start bot
bot.startPolling()
