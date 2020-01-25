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

var VoiceRecorder = class {
  constructor(config, emitter, bot, logger, ipcMain, addonHandler) {
    this.config = config;
    this.logger = logger;
    this.emitter = emitter;
    this.bot = bot;
    this.ipcMain = ipcMain;
    this.addonHandler = addonHandler;
  }

  init() {
    if (config.voiceReply === null) {
      this.logger.warn("Voice replies are disabeled");
      return;
    }

    if (config.voiceReply.key !== undefined) {
      globalShortcut.register(config.voiceReply.key, () => {
        this.emitter.send("recordButtonPressed");
      });
    }

    this.ipcMain.on('record', (event, chatId, messageId) => {
      this.record(chatId, messageId);
    })
  }

  record(chatId, messageId) {
    // function that records voice and tells bot to send it as voice reply
    const logger = console;
    let maxRecTime;

    if (!chatId || !messageId) {
      this.emitter.send("recordError");
      this.addonHandler.executeEventCallbacks('recordError');
      return logger.warn(`Can'! reply! chatId or messageId is empty`);
    }

    this.emitter.send("recordStarted");
    this.addonHandler.executeEventCallbacks('recordStarted');

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

    const fileStream = fs.createWriteStream(fileName, { encoding: `binary` });

    audioRecorder
      .start()
      .stream()
      .pipe(fileStream);

    audioRecorder.stream().on(
      `close`,
      function(code) {
        logger.warn(`Recording closed. Exit code: `, code);
        clearInterval(maxRecTime);
        this.bot.sendAudio(fileName, chatId, messageId);
      }.bind(this)
    );

    audioRecorder.stream().on(
      `end`,
      function() {
        logger.warn(`Recording ended.`);
        this.emitter.send("recordStopped");
        this.addonHandler.executeEventCallbacks('recordStopped');

        clearInterval(maxRecTime);
      }.bind(this)
    );

    audioRecorder.stream().on(
      `error`,
      function() {
        logger.warn(`Recording error.`);
        this.emitter.send("recordError");
        this.addonHandler.executeEventCallbacks('recordError');
        clearInterval(maxRecTime);
      }.bind(this)
    );

    maxRecTime = setTimeout(
      function() {
        logger.log("MAX Stop recording");
        audioRecorder.stop();
        this.emitter.send("recordStopped");
        this.addonHandler.executeEventCallbacks('recordStopped');
      }.bind(this),
      config.voiceReply.maxRecordTime
    );
  }
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = VoiceRecorder;
}
