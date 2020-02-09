const {exec, execSync} = require("child_process");

/**
 * Start blinking of an LED when a new image arrives.
 * @param  {AddonBase} interface   object to register and send events
 */
const newImageNotifyLed = (interface) => {
  // check if pin was configured
  if (typeof interface.config.newLedGPIO !== 'number') {
    const error = `LED pin is not definied!`;
    interface.logger.error(error);
    throw error;
  }

  // id returnd from setInterval from updateLedStatus()
  let blinkTimerId;

  /**
   * Execute the system command async
   * @param  {string} cmd [description]
   */
  const execCmd = (cmd) => {
    exec(cmd, (execError, _stdout, stderr) => {
      if (execError) {
        interface.logger.error(`Executing: ${cmd} ! ${stderr}`);
      }
    })
    //interface.logger.warn('exec', cmd)
  };

  /**
   * Update the led blink status
   */
  const updateLedStatus = () => {
    // build the unseen images count
    let unseenCnt = 0;
    interface.images.forEach(img => {
      if (img.unseen) {
          ++unseenCnt;
      }
    });
    // remove running timer
    clearInterval(blinkTimerId);
    if (unseenCnt > 0) {
      // initialize interval
      let interval = interface.config.blinkInterval || 1500;
      // blink faster if more then one unseen image exists
      if (unseenCnt > 1) {
        interval /= 2;
      }
      // start the timer to update status and execute the gpio command
      let ledStatus = 0;
      blinkTimerId = setInterval(() => {
        ledStatus = (ledStatus === 1 ? 0 : 1);
        execCmd(`gpio -g write ${interface.config.newLedGPIO} ${ledStatus}`);
      }, interval);
    } else {
      // turn led off
      execCmd(`gpio -g write ${interface.config.newLedGPIO} 0`);
    }
  }

  // initialize gpio. execSync throws an error if the command has failed
  execSync(`gpio -g mode ${interface.config.newLedGPIO} out && gpio -g write ${interface.config.newLedGPIO} 0`, true);

  // registser listeners
  interface.registerListener(['images-loaded', 'newImage', 'imageUnseenRemoved', 'imageDeleted'], updateLedStatus);
};


/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = newImageNotifyLed
}
