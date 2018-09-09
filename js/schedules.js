var schedule = require('node-schedule');
const exec = require("child_process").exec;

var schedules = class {
  constructor(config, logger) {
    this.turnOnHour = config.turnOnHour;
    this.turnOffHour = config.turnOffHour;
    this.logger = logger;
    var self = this;

    this.monitorOnSchedule = schedule.scheduleJob('* * ' + this.turnOnHour.toString() + ' * * *', function() {
      self.turnMonitorOn();
    });

    this.monitorOffSchedule = schedule.scheduleJob('* * ' + this.turnOffHour.toString() + ' * * *', function() {
      self.turnMonitorOff();
    });

    this.logger.info('Scheduler started ...')

  }

  turnMonitorOn() {
    exec("tvservice --preferred && sudo chvt 6 && sudo chvt 7", opts, function(error, stdout, stderr){ self.checkForExecError(error, stdout, stderr, res); });
  }

  turnMonitorOff() {
    exec("tvservice -o", opts, function(error, stdout, stderr){ self.checkForExecError(error, stdout, stderr, res); });
  }
}

if (typeof module !== "undefined") {
  module.exports = schedules;
}
