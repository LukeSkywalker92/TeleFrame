/**
 * Demo auto control.
 * Take control of TeleFrame. Activate 'pause' und randomly send the commands 'next'|'previous' for 5-10 images.
 * Return control for 17-23 seconds and then start again.
 * @param  {AddonBase inherited} interface   object to register and send events
 */
const functionExampleAutoControl = (interface) => {

  /**
   * returns a random integer between min and max
   * @param  {number} min
   * @param  {number} max
   * @return {number}     the ranom number
   */
  const randomIntegerBetween = (min, max) => {
    return Math.floor(min + Math.random()*(max + 1 - min))
  };

  /**
   * Send pause, then randomly the commands previous or next and also messages at start and end
   */
  const autoControl = () => {
    //interface.logger.warn(`Now I'm taking over :-)`);
    interface.sendEvent('messageBox', {
      html: `<p><small>${interface.name} said:</small><br>Now I'm taking over \u{1F608}</p>`,
      position: 'top-end',
      timer: 1800000,
      background: 'rgba(255,255,255, 0.6)',
      allowOutsideClick: false
    });
    //interface.logger.info(`Send event: pause`);
    interface.sendEvent('pause');
    // initialize change images count
    interface.changedImages = 0;
    // send ramom previus or naxt command after 3 - 5 seconds
    const autoTimer = setInterval(() => {
      let cmd = (randomIntegerBetween(0, 1) ? 'next' : 'previous');
      //interface.logger.info(`Send event: ${cmd}`);
      interface.sendEvent(cmd, randomIntegerBetween(1500, 2000));
      if (++interface.changedImages > randomIntegerBetween(4, 9)) {
        clearTimeout(autoTimer);
        // restart autoControl after 17 - 23 seconds
        setTimeout(() => autoControl(), randomIntegerBetween(17000, 23000));
        //interface.logger.warn(`Now you ...`);
        interface.sendEvent('messageBox', {
          html: `<p><small>${interface.name} said:</small><br>Now you \u{1F60E}</p>`,
          timer: 3500
        });
        interface.sendEvent('play');
      }
    }, randomIntegerBetween(3000, 5000));
  };

  // when the renderer is ready start the auto control timer
  interface.registerListener('renderer-ready', () => {
    setTimeout(() => autoControl(), 23000);
    interface.logger.info('Started auto control timer');
  });
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = functionExampleAutoControl;
}
