const exec = require("child_process").exec;

class CommandExecutor {
  constructor(emitter, logger, ipcMain) {
    this.emitter = emitter
    this.logger = logger
    this.ipcMain = ipcMain
  }

  init() {
    this.ipcMain.on('executeSystemCommand', (event, command) => {
      this.executeSystemCommand(command)
    })
  }

  executeSystemCommand(command) {
    var self = this;
    exec(command, self.opts, function(error, stdout, stderr) {
      self.checkForExecError(error, stdout, stderr);
      return(error, stdout, stderr)
    });
  }

  checkForExecError(error, stdout, stderr, res) {
		console.log(stdout);
		console.log(stderr);
		if (error) {
			console.log(error);
			return;
		}
	}

}

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = CommandExecutor;
}
