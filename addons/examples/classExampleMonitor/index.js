const {AddonBase} = require(`${__dirname}/../../js/addonInterface`);

class ClassExampleMonitor  extends AddonBase {
  constructor(config) {
    super(config);

    // register all event listeners to log what happens

    this.registerListener('images-loaded', () => this.logger.warn('images-loaded'));

    this.registerListener('renderer-ready', () => this.logger.warn('renderer-ready'));

    this.registerListener('deleteImage', index => this.logger.info('deleteImage', index));

    this.registerListener('imageDeleted', () => this.logger.info('imageDeleted'));

    this.registerListener('paused', (status) => this.logger.info('paused', status));

    this.registerListener('muted', (status) => this.logger.info('muted', status));

    this.registerListener('recordStarted', () => this.logger.info('recordStarted'));

    this.registerListener('recordStopped', () => this.logger.info('recordStopped'));

    this.registerListener('recordError', () => this.logger.info('recordErrorAddon'));

    this.registerListener('unstarImage', index => this.logger.info('unstarImage', index));

    this.registerListener('starImage', index => this.logger.info('starImage', index));

    this.registerListener('changingActiveImage', (index, fadeTime) => this.logger.info('changingActiveImage', index, fadeTime, this.images[index].src));

    this.registerListener('changedActiveImage', index => this.logger.info('changedActiveImage', index, this.images[index].src));

    this.registerListener('newImage', (sender, type) => {
      let unseenCnt = 0;
      this.images.forEach(img => unseenCnt += (img.unseen ? 1 : 0));
      this.logger.info('newImage', this.images[0].src, `Unseen images: ${unseenCnt}`);
    });

    this.registerListener('removeImageUnseen', () => this.logger.info('removeImageUnseen'));
    this.registerListener('imageUnseenRemoved', () => this.logger.info('imageUnseenRemoved'));
  }
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = ClassExampleMonitor;
}
