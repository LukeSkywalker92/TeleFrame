const { globalShortcut } = require("electron");
const AudioRecorder = require("node-audiorecorder");

const fs = require(`fs`);
const path = require(`path`);

const options = {
  program: `rec`, // Which program to use, either `arecord`, `rec`, or `sox`.
  device: null, // Recording device to use.

  //bits: 16, // Sample size. (only for `rec` and `sox`)
  channels: 1, // Channel count.
  encoding: `signed-integer`, // Encoding type. (only for `rec` and `sox`)
  rate: 16000, // Sample rate.
  type: `wav`, // Format type.

  // Following options only available when using `rec` or `sox`.
  silence: 2, // Duration of silence in seconds before it stops recording.
  thresholdStart: 0.5, // Silence threshold to start recording.
  thresholdStop: 0.5, // Silence threshold to stop recording.
  keepSilence: true // Keep the silence in the recording.
};

var InputHandler = class {
  constructor(config, emitter, bot, logger) {
    this.config = config;
    this.logger = logger;
    this.emitter = emitter;
    this.bot = bot;
  }

  init() {
    if (config.keys === null) {
      this.logger.warn("Keyboard controls are disabeled");
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

    globalShortcut.register("a", () => {
      const logger = console;
      let maxRecTime;
      let bot = this.bot;
      let emitter = this.emitter;

      this.emitter.send("recordStarted");

      let audioRecorder = new AudioRecorder(options, logger);
      logger.log("Start recording");

      const fileName = path.join(
        "audiofiles",
        Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, ``)
          .substr(0, 4)
          .concat(`.wav`)
      );

      logger.log(`Writing new recording file at: `, fileName);

      // Create write stream.
      const fileStream = fs.createWriteStream(fileName, { encoding: `binary` });
      // Start and write to the file.
      audioRecorder
        .start()
        .stream()
        .pipe(fileStream);

      // Log information on the following events
      audioRecorder.stream().on(`close`, function(code) {
        console.warn(`Recording closed. Exit code: `, code);
        clearInterval(maxRecTime);
        bot.sendAudio(fileName);
      });

      audioRecorder.stream().on(`end`, function() {
        console.warn(`Recording ended.`);
        emitter.send("recordStopped");
        clearInterval(maxRecTime);
      });

      audioRecorder.stream().on(`error`, function() {
        console.warn(`Recording error.`);
        emitter.send("recordError");
        clearInterval(maxRecTime);
      });

      maxRecTime = setTimeout(() => {
        logger.log("MAX Stop recording");
        audioRecorder.stop();
      }, 10000);
    });
  }
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = InputHandler;
}
