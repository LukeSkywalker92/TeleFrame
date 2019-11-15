var schedule = require('node-schedule');
const exec = require("child_process").exec;

var schedules = class {
  constructor(config, logger) {
    this.turnOnHour = config.turnOnHour;
    this.turnOffHour = config.turnOffHour;
    this.hdmiScreen = config.hdmiScreen;  
    this.logger = logger;
    this.opts = {timeout: 15000};
    var self = this;

    //generate schedule for turning the monitor on
    this.monitorOnSchedule = schedule.scheduleJob('* * ' + this.turnOnHour.toString() + ' * * *', function() {
      self.turnMonitorOn();
    });

    //generate schedule for turning the monitor off
    this.monitorOffSchedule = schedule.scheduleJob('* * ' + this.turnOffHour.toString() + ' * * *', function() {
      self.turnMonitorOff();
    });

    this.logger.info('Scheduler started ...')

  }

  //execute command for turning the monitor on
  turnMonitorOn() {
    var self = this;
    if (hdmiScreen) {
      exec("tvservice --preferred && sudo chvt 6 && sudo chvt 7", self.opts, function(error, stdout, stderr) {
        self.checkForExecError(error, stdout, stderr);
      });
    } else {
      exec("sudo echo 0 > /sys/class/backlight/rpi_backlight/bl_power", self.opts, function(error, stdout, stderr) {
        self.checkForExecError(error, stdout, stderr);
      });
    }
  }

  //execute command for turning the monitor off
  turnMonitorOff() {
    var self = this;
    if (!hdmiScreen) {
      exec("tvservice -o", self.opts, function(error, stdout, stderr) {
           self.checkForExecError(error, stdout, stderr);
      });
    } else {
      exec("sudo echo 1 > /sys/class/backlight/rpi_backlight/bl_power", self.opts, function(error, stdout, stderr) {
        self.checkForExecError(error, stdout, stderr);
      });
    }
  }

  //check for execution error
  checkForExecError(error, stdout, stderr, res) {
		console.log(stdout);
		console.log(stderr);
		if (error) {
			console.log(error);
			return;
		}
	}
}

if (typeof module !== "undefined") {
  module.exports = schedules;
}
