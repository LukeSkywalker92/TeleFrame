var schedule = require('node-schedule');
const exec = require("child_process").exec;

var schedules = class {
    constructor(config, screen, logger) {
    this.turnOnHour = config.turnOnHour;
    this.turnOffHour = config.turnOffHour;
    this.screen = screen;
    this.logger = logger;
    this.opts = {timeout: 15000};
    var self = this;

    // initialize the monitor control if required
    if(this.screen.cmdInit.length >0){
	exec(this.screen.cmdInit , this.opts, function(error, stdout, stderr) {
        self.checkForExecError(error, stdout, stderr);
      });
    }

    //generate schedule for turning the monitor on
    this.monitorOnSchedule = schedule.scheduleJob('0 0 ' + this.turnOnHour.toString() + ' * * *', function() {
      self.turnMonitorOn();
    });

    //generate schedule for turning the monitor off
    this.monitorOffSchedule = schedule.scheduleJob('0 0 ' + this.turnOffHour.toString() + ' * * *', function() {
      self.turnMonitorOff();
    });

    this.logger.info('Scheduler started ...')

  }

  //execute command for turning the monitor on
  turnMonitorOn() {
    var self = this;
    exec(self.screen.cmdBacklightOn, self.opts, function(error, stdout, stderr) {
      self.checkForExecError(error, stdout, stderr);
    });
  }

  //execute command for turning the monitor off
  turnMonitorOff() {
    var self = this;
    exec(self.screen.cmdBacklightOff, self.opts, function(error, stdout, stderr) {
      self.checkForExecError(error, stdout, stderr);
    });
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
