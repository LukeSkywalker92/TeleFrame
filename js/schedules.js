var schedule = require('node-schedule');

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
    console.log('on');
  }

  turnMonitorOff() {
    console.log('off');
  }
}

if (typeof module !== "undefined") {
  module.exports = schedules;
}
