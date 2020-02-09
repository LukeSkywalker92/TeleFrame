/**
 * Listen to all available events and output to the logger
 * @param  {AddonBase inherited} interface   object to register and send events
 */
const functionExampleMonitorAndConfig = (interface) => {

  // register all event listeners to log what happens

  interface.registerListener('images-loaded', () => interface.logger.warn('images-loaded'));

  interface.registerListener('renderer-ready', () => interface.logger.warn('renderer-ready'));

  interface.registerListener('deleteImage', index => interface.logger.info('deleteImage', index));

  interface.registerListener('imageDeleted', () => interface.logger.info('imageDeleted'));

  interface.registerListener('paused', (status) => interface.logger.info('paused', status));

  interface.registerListener('muted', (status) => interface.logger.info('muted', status));

  interface.registerListener('recordStarted', () => interface.logger.info('recordStarted'));

  interface.registerListener('recordStopped', () => interface.logger.info('recordStoppedAddon'));

  interface.registerListener('recordError', () => interface.logger.info('recordErrorAddon'));

  interface.registerListener('unstarImage', index => interface.logger.info('unstarImage', index));

  interface.registerListener('starImage', index => interface.logger.info('starImage', index));

  interface.registerListener('changingActiveImage', (index, fadeTime) => interface.logger.info('changingActiveImage', index, fadeTime, interface.images[index].src));

  interface.registerListener('changedActiveImage', index => interface.logger.info('changedActiveImage', index, interface.images[index].src));

  interface.registerListener('newImage', (sender, type) => {
    let unseenCnt = 0;
    interface.images.forEach(img => unseenCnt += (img.unseen ? 1 : 0));
    interface.logger.info('newImage', sender, type, `Unseen images: ${unseenCnt}`);
  });

  interface.registerListener('removeImageUnseen', () => interface.logger.info('removeImageUnseen'));
  interface.registerListener('imageUnseenRemoved', () => interface.logger.info('imageUnseenRemoved'));
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = functionExampleMonitorAndConfig;
}
