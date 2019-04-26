const { globalShortcut } = require("electron");

var InputHandler = class {
  constructor(config, emitter, logger) {
    this.config = config;
    this.logger = logger;
    this.emitter = emitter;
  }

  init() {
    globalShortcut.register("right", () => {
      this.emitter.send("next");
    });

    globalShortcut.register("left", () => {
      this.emitter.send("previous");
    });

    globalShortcut.register("k", () => {
      this.emitter.send("pause");
    });

    globalShortcut.register("l", () => {
      this.emitter.send("play");
    });
  }
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = InputHandler;
}
