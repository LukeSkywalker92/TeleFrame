const {AddonBase} = require(`${__dirname}/../../js/addonInterface`);

class ClassExampleAutoControl  extends AddonBase {
  constructor(config) {
    super(config);

    // when the renderer is ready start the auto control timer
    this.registerListener('renderer-ready', () => {
      setTimeout(() => this.autoControl(), 25000)
      this.logger.info('Started auto control timer');
    });
  }

  /**
   * returns a random integer between min and max
   * @param  {number} min
   * @param  {number} max
   * @return {number}     the ranom number
   */
  randomIntegerBetween(min, max) {
    return Math.floor(min + Math.random()*(max + 1 - min))
  }

  /**
   * Send pause, then randomly the commands previous or next and also messages at start and end
   */
  autoControl() {
    //this.logger.warn(`Now I'm taking over :-)`);
    this.sendEvent('messageBox', {
      html: `<p><small>${this.name} said:</small><br>Now I'm taking over \u{1F608}</p>`,
      position: 'top-end',
      timer: 1800000,
      background: 'rgba(255,255,255, 0.6)',
      allowOutsideClick: false
    });
    this.logger.info(`Send event: pause`);
    this.sendEvent('pause');

    this.changedImages = 0;

    const autoTimer = setInterval(() => {
      let cmd = (this.randomIntegerBetween(0, 1) ? 'next' : 'previous');
      this.logger.info(`Send event: ${cmd}`);
      this.sendEvent(cmd, this.randomIntegerBetween(1500, 2000));
      if (++this.changedImages > this.randomIntegerBetween(4, 9)) {
        clearTimeout(autoTimer);
        // restart autoControl after 17 - 23 seconds
        setTimeout(() => this.autoControl(), this.randomIntegerBetween(17000, 23000));
        //this.logger.warn(`Now you ...`);
        this.sendEvent('messageBox', {
          html: `<p><small>${this.name} said:</small><br>Now you \u{1F60E}</p>`,
          timer: 3500
        });
        this.sendEvent('play');
      }

    }, this.randomIntegerBetween(3000, 5000));
  }
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = ClassExampleAutoControl;
}
