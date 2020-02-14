var schedule = require('node-schedule');
const exec = require("child_process").exec;

var schedules = class {
    constructor(config, screen, logger, addonInterface) {
    this.turnOnHour = config.turnOnHour;
    this.turnOffHour = config.turnOffHour;
    this.screen = screen;
    this.screen.screenOn = true;
    this.logger = logger;
    this.addonInterface = addonInterface;
    this.opts = {timeout: 15000};
    var self = this;

    // check if the screen configuration needs to be initialized
    if (this.screen.init && typeof this.screen.init === 'function') {
      this.screen.init(config.screenSwitchOptions, this.logger);
    }

    // initialize the monitor control if required
    if(this.screen.cmdInit.length >0){
	     exec(this.screen.cmdInit , this.opts, function(error, stdout, stderr) {
        self.checkForExecError(error, stdout, stderr);
      });
    }

    // create scheduler
    if (config.toggleMonitor && parseInt(this.turnOnHour) >= 0 && parseInt(this.turnOffHour) <= 24)
    {
      //generate schedule for turning the monitor on
      this.monitorOnSchedule = schedule.scheduleJob('0 18 ' + this.turnOnHour.toString() + ' * * *', function() {
        self.turnMonitorOn();
      });
      //generate schedule for turning the monitor off
      this.monitorOffSchedule = schedule.scheduleJob('0 17 ' + this.turnOffHour.toString() + ' * * *', function() {
        self.turnMonitorOff();
      });

      this.logger.info('Scheduler started ...')
    }
  }

  //execute command for turning the monitor on
  turnMonitorOn() {
    var self = this;
    exec(self.screen.cmdBacklightOn, self.opts, function(error, stdout, stderr) {
      if (!error) {
        self.screen.screenOn = true;
        self.addonInterface.executeEventCallbacks('screenOn', true)
      }
      self.checkForExecError(error, stdout, stderr);
    });
  }

  //execute command for turning the monitor off
  turnMonitorOff() {
    var self = this;
    exec(self.screen.cmdBacklightOff, self.opts, function(error, stdout, stderr) {
      if (!error) {
        self.screen.screenOn = false;
        self.addonInterface.executeEventCallbacks('screenOn', false)
      }
      self.checkForExecError(error, stdout, stderr);
    });
  }

  //check for execution error
  checkForExecError(error, stdout, stderr, res) {
    this.logger.info(stdout);
		if (error) {
			this.logger.error(error);
			return;
		}
	}
}

if (typeof module !== "undefined") {
  module.exports = schedules;
}
