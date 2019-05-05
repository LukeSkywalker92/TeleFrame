const Telegraf = require("telegraf");
const Telegram = require("telegraf/telegram");
const download = require("image-downloader");
const moment = require("moment");

const fs = require(`fs`);

var Bot = class {
  constructor(
    botToken,
    imageFolder,
    imageWatchdog,
    showVideo,
    whitelistChats,
    voiceReply,
    logger
  ) {
    var self = this;
    this.bot = new Telegraf(botToken);
    this.telegram = new Telegram(botToken);
    this.logger = logger;
    this.imageFolder = imageFolder;
    this.imageWatchdog = imageWatchdog;
    this.showVideo = showVideo;
    this.whitelistChats = whitelistChats;
    this.voiceReply = voiceReply;

    //get bot name
    this.bot.telegram.getMe().then((botInfo) => {
      this.bot.options.username = botInfo.username;
      this.logger.info(
        "Using bot with name " + this.bot.options.username + "."
      );
    });

    //Welcome message on bot start
    this.bot.start((ctx) => ctx.reply("Welcome"));

    //Help message
    this.bot.help((ctx) => ctx.reply("Send me an image."));

    //Download incoming photo
    this.bot.on("photo", (ctx) => {
      if (
        !(
          this.whitelistChats.length > 0 &&
          this.whitelistChats.indexOf(ctx.update.message.from.id) !== -1
        )
      ) {
        console.log(
          "Whitelist triggered:",
          ctx.update.message.from.id,
          this.whitelistChats,
          this.whitelistChats.indexOf(ctx.update.message.from.id)
        );
        ctx.reply(
          "Hey there, this bot is whitelisted, pls add your chat id to the config file"
        );
        return;
      }

      this.telegram
        .getFileLink(ctx.message.photo[ctx.message.photo.length - 1].file_id)
        .then((link) => {
          download
            .image({
              url: link,
              dest: this.imageFolder + "/" + moment().format("x") + ".jpg"
            })
            .then(({ filename, image }) => {
              this.newImage(
                filename,
                ctx.message.from.first_name,
                ctx.message.caption
              );
            })
            .catch((err) => {
              this.logger.error(err);
            });
        });
    });

    //Download incoming video
    this.bot.on("video", (ctx) => {
      if (
        !(
          this.whitelistChats.length > 0 &&
          this.whitelistChats.indexOf(ctx.update.message.from.id) !== -1
        )
      ) {
        console.log(
          "Whitelist triggered:",
          ctx.update.message.from.id,
          this.whitelistChats,
          this.whitelistChats.indexOf(ctx.update.message.from.id)
        );
        ctx.reply(
          "Hey there, this bot is whitelisted, pls add your chat id to the config file"
        );
        return;
      }

      if (this.showVideo) {
        this.telegram.getFileLink(ctx.message.video.file_id).then((link) => {
          download
            .image({
              url: link,
              dest: this.imageFolder + "/" + moment().format("x") + ".mp4"
            })
            .then(({ filename, image }) => {
              this.newImage(
                filename,
                ctx.message.from.first_name,
                ctx.message.caption
              );
            })
            .catch((err) => {
              this.logger.error(err);
            });
        });
      }
    });

    this.bot.catch((err) => {
      this.logger.error(err);
    });

    //Some small conversation
    this.bot.hears(/hi/i, (ctx) => {
      ctx.reply(
        `Hey there ${ctx.chat.first_name} \n Your ChatID is ${ctx.chat.id}`
      );
      console.log(ctx.chat);
    });

    this.logger.info("Bot created!");
  }

  startBot() {
    //Start bot
    var self = this;
    this.bot.startPolling(30, 100, null, () =>
      setTimeout(() => self.startBot(), 30000)
    );
    this.logger.info("Bot started!");
    /*
    this.sendMessage("Bot ready!")
      .then(() => {
        console.log("success");
      })
      .catch((err) => {
        console.log("error", err);
      });
      */
  }

  newImage(src, sender, caption) {
    //tell imageWatchdog that a new image arrived
    this.imageWatchdog.newImage(src, sender, caption);
  }

  sendMessage(message) {
    return this.bot.telegram.sendMessage(this.whitelistChats[0], message);
  }

  sendAudio(filename) {
    fs.readFile(
      filename,
      function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        for (let i = 0; i < this.voiceReply.sendTo.length; i++) {
          this.bot.telegram
            .sendVoice(this.voiceReply.sendTo[i], {
              source: data
            })
            .then(() => {
              console.log("success");
            })
            .catch((err) => {
              console.log("error", err);
            });
        }
      }.bind(this)
    );
  }
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = Bot;
}
