const { app, BrowserWindow, ipcMain } = require("electron");
const { logger, rendererLogger } = require("./js/logger");
const telebot = require("./js/bot");
const imagewatcher = require("./js/imageWatchdog");
const inputhandler = require("./js/inputHandler");
const voicerecorder = require("./js/voiceRecorder");
const schedules = require("./js/schedules");
const CommandExecutor = require("./js/systemCommands");
const config = require("./js/configuration");

//create global variables
global.config = config;
global.rendererLogger = rendererLogger;
global.images = [];


logger.info("Main app started ...");

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1024,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false
  });

  win.setFullScreen(config.fullscreen);
  // and load the index.html of the app.
  win.loadFile("index.html");

  // get instance of webContents for sending messages to the frontend
  const emitter = win.webContents;

  // create imageWatchdog and bot
  var imageWatchdog = new imagewatcher(
    config.imageFolder,
    config.imageCount,
    config.autoDeleteImages,
    global.images,
    emitter,
    logger,
    ipcMain
  );
  imageWatchdog.init()

  var bot = new telebot(
    config.botToken,
    config.imageFolder,
    imageWatchdog,
    config.showVideos,
    config.whitelistChats,
    config.whitelistAdmins,
    config.voiceReply,
    logger,
    emitter,
    ipcMain,
    config
  );

  var inputHandler = new inputhandler(config, emitter, bot, logger);
  inputHandler.init();

  var commandExecutor = new CommandExecutor(emitter, logger, ipcMain);
  commandExecutor.init();

  if (config.voiceReply !== null) {
    var voiceReply = new voicerecorder(config, emitter, bot, logger, ipcMain);
    voiceReply.init();
  }

  // generate scheduler, when times for turning monitor off and on
  // are given in the config file
  if (config.toggleMonitor) {
    var scheduler = new schedules(config, logger);
  }

  // Open the DevTools.
  if (config.develop) {
    win.webContents.openDevTools()
  }
  bot.startBot();

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
