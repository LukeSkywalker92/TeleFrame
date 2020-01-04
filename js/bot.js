const Telegraf = require("telegraf");
const Telegram = require("telegraf/telegram");
const Extra = require('telegraf/extra')
const download = require("image-downloader");
const moment = require("moment");
const exec = require("child_process").exec;

const fs = require(`fs`);

var Bot = class {
  constructor(
    botToken,
    imageFolder,
    imageWatchdog,
    showVideo,
    whitelistChats,
    whitelistAdmins,
    voiceReply,
    logger,
    emitter,
    ipcMain,
    config
  ) {
    var self = this;
    this.bot = new Telegraf(botToken);
    this.telegram = new Telegram(botToken);
    this.logger = logger;
    this.imageFolder = imageFolder;
    this.imageWatchdog = imageWatchdog;
    this.showVideo = showVideo;
    this.whitelistChats = whitelistChats;
    this.whitelistAdmins = whitelistAdmins;
    this.voiceReply = voiceReply;
    this.config = config;
    this.emitter = emitter;
    this.ipcMain = ipcMain;

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


    //Middleware Check for whitelisted  ChatID
    const isChatWhitelisted = (ctx, next) => {
      if (
        (
          this.whitelistChats.length > 0 &&
          this.whitelistChats.indexOf(ctx.message.chat.id) == -1
        )
      ){
        this.logger.info(
          "Whitelist triggered:",
          ctx.message.chat.id,
          this.whitelistChats,
          this.whitelistChats.indexOf(ctx.message.chat.id)
        );
        ctx.reply(
          "Hey there, this bot is whitelisted, pls add your chat id to the config file"
        );

        //Break if Chat is not whitelisted
        return ;
      }

      return next();
    }


    //Middleware Check for whitelisted  ChatID
    const isAdminWhitelisted = (ctx, next) => {
      if (
          this.whitelistAdmins.indexOf(ctx.message.chat.id) == -1
      ){
        this.logger.info(
          "Admin-Whitelist triggered:",
          ctx.message.chat.id,
          this.whitelistAdmins,
          this.whitelistAdmins.indexOf(ctx.message.chat.id)
        );
        ctx.reply(
          "Hey the Admin-Actions of this bot are whitelisted, pls add your chat id to the config file"
        );

        //Break if Chat is not whitelisted
        return ;
      }

      return next();
    }

    //Download incoming assets
    this.bot.on(['photo', 'video', 'document'], isChatWhitelisted, (ctx) => {
      let fileId;
      if (ctx.updateSubTypes.indexOf('photo') > -1) {
        fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      } else if (ctx.updateSubTypes.indexOf('video') > -1) {
        fileId = ctx.message.video.file_id
      } else if (ctx.updateSubTypes.indexOf('document') > -1) {
        fileId = ctx.message.document.file_id;
      }
      

      this.telegram.getFileLink(fileId).then((link) => {
        // check for supported file types
        if (link.match(/\.(mp4|jpg|gif|png)$/) === null) {
          if (config.botReply) {
            ctx.reply(config.phrases.documentFormatError)  
          }
          return;
        }

        let fileExtension = '.' + link.split('.').pop();
        // let bot reply, if wanted
        if (config.botReply) {
            if (fileExtension.match(/\.(mp4|gif)$/)){
              ctx.reply("\u{1F44D}\u{1F3A5}");  
            } else if (fileExtension.match(/\.(jpg|png)$/)){
              ctx.reply("\u{1F44D}\u{1F4F8}");
            }
        }
        if (fileExtension !== '.mp4' || this.showVideo) {
          download
            .image({
              url: link,
              dest: this.imageFolder + "/" + moment().format("x") + fileExtension
            })
            .then(({ filename, image }) => {
              var chatName = ''
              if (ctx.message.chat.type == 'group') {
                chatName = ctx.message.chat.title;
              } else if (ctx.message.chat.type == 'private') {
                chatName = ctx.message.from.first_name;
              }
              this.newImage(
                filename,
                ctx.message.from.first_name,
                ctx.message.caption,
                ctx.message.chat.id,
                chatName,
                ctx.message.message_id
              );
            })
            .catch((err) => {
              this.logger.error(err);
            });
          }
        });
    });

    this.bot.catch((err) => {
      this.logger.error(err);
    });

    //Some small conversation
    this.bot.hears(/^hi/i, (ctx) => {
      ctx.reply(
        `Hey there ${ctx.chat.first_name} \nYour ChatID is ${ctx.chat.id}`
      );
      this.logger.info(ctx.chat);
    });


    //Add Admin Actions from config to Bot-Command
    if(this.config.adminAction.allowAdminAction ){
      var actions = this.config.adminAction.actions;
      this.logger.info("Add Admin-Actions");

      actions.forEach(action => {
        //only add action if comman isn't (empty or null) and action is enabled
        if(!!action.command && action.enable){
        this.bot.command(action.name, isAdminWhitelisted, (ctx) => {
          this.logger.warn("Command received: "+action.name);
          this.logger.warn(action.command);
          ctx.reply("Triggered Action '"+action.name+"'");

          exec(action.command, (error, stdout, stderr) => {
            if (error) {
              console.error(stderr);
              ctx.reply("ERROR!!!\n\nExitcode: "+error.code+"\nStdErr: "+stderr);
              return;
            }

            console.log(stdout)
            ctx.reply("SUCCESS!!!\n\n"+stdout);
          });
        })

        }
      });

    }

    this.logger.info("Bot created!");
  }



  startBot() {
    //Start bot
    var self = this;
    this.bot.startPolling(30, 100, null, () =>
      setTimeout(() => self.startBot(), 30000)
    );
    this.logger.info("Bot started!");
  }

  newImage(src, sender, caption, chatId, chatName, messageId) {
    //tell imageWatchdog that a new image arrived
    this.imageWatchdog.newImage(src, sender, caption, chatId, chatName, messageId);
  }

  sendMessage(message) {
    // function to send messages, used for whitlist handling
    return this.bot.telegram.sendMessage(this.whitelistChats[0], message);
  }

  sendAudio(filename, chatId, messageId) {
    // function to send recorded audio as voice reply
    fs.readFile(
      filename,
      function(err, data) {
        if (err) {
          this.logger.error(err);
          return;
        }
          this.telegram
            .sendVoice(chatId, {
              source: data
            }, {
              reply_to_message_id: messageId
            })
            .then(() => {
              this.logger.info("success");
            })
            .catch((err) => {
              this.logger.error("error", err);
            });

      }.bind(this)
    );
  }

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = Bot;
}
