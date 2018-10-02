const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')
const download = require('image-downloader')
const moment = require('moment');

var Bot = class {
	constructor(botToken, imageFolder, imageWatchdog, showVideo, logger) {
		var self = this;
		this.bot = new Telegraf(botToken);
		this.telegram = new Telegram(botToken);
		this.logger = logger;
		this.imageFolder = imageFolder;
		this.imageWatchdog = imageWatchdog;
		this.showVideo = showVideo;

		//get bot name
		this.bot.telegram.getMe().then((botInfo) => {
			this.bot.options.username = botInfo.username;
		})

		//Welcome message on bot start
		this.bot.start((ctx) => ctx.reply('Welcome'));

		//Help message
		this.bot.help((ctx) => ctx.reply('Send me an image.'));

		//Download incoming photo
		this.bot.on('photo', (ctx) => {
			this.telegram.getFileLink(ctx.message.photo[ctx.message.photo.length - 1].file_id).then(
				link => {
					download.image({
							url: link,
							dest: this.imageFolder + '/' + moment().format('x') + '.jpg'
						})
						.then(({
							filename,
							image
						}) => {
							this.newImage(filename, ctx.message.from.first_name, ctx.message.caption);
						})
						.catch((err) => {
							this.logger.error(err);
						})
				}
			)
		});

		//Download incoming video
		this.bot.on('video', (ctx) => {
			if (this.showVideo) {
				this.telegram.getFileLink(ctx.message.video.file_id).then(
					link => {
						download.image({
								url: link,
								dest: this.imageFolder + '/' + moment().format('x') + '.mp4'
							})
							.then(({
								filename,
								image
							}) => {
								this.newImage(filename, ctx.message.from.first_name, ctx.message.caption);
							})
							.catch((err) => {
								this.logger.error(err);
							})
					}
				)
			}
		});

		this.bot.catch((err) => {
			this.logger.error(err)
		})

		//Some small conversation
		this.bot.hears('hi', (ctx) => ctx.reply('Hey there'));

		this.logger.info('Bot created!');
	}

	startBot() {
		//Start bot
		var self = this;
		this.bot.startPolling(30, 100, null, () => setTimeout(() => self.startBot(), 30000));
		this.logger.info('Bot started!');
	}

	newImage(src, sender, caption) {
		//tell imageWatchdog that a new image arrived
		this.imageWatchdog.newImage(src, sender, caption);
	}


}

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
	module.exports = Bot;
}
