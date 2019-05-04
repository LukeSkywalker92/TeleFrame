const { globalShortcut } = require("electron");

var InputHandler = class {
  constructor(config, emitter, logger) {
    this.config = config;
    this.logger = logger;
    this.emitter = emitter;
  }

  init() {
    if(config.keys === null) {
      this.logger.warn("Keyboard controls are disabeled")
      return;
    }

    globalShortcut.register(config.keys.next, () => {
      this.emitter.send("next");
    });

    globalShortcut.register(config.keys.previous, () => {
      this.emitter.send("previous");
    });

    globalShortcut.register(config.keys.pause, () => {
      this.emitter.send("pause");
    });

    globalShortcut.register(config.keys.play, () => {
      this.emitter.send("play");
    });
  }
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = InputHandler;
}
