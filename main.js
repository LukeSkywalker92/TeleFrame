const {
  app,
  BrowserWindow
} = require('electron')
const {
  logger,
  rendererLogger
} = require('./js/logger')
const config = require('./config/config')
const telebot = require('./js/bot')
const imagewatcher = require('./js/imageWatchdog')
const schedules = require('./js/schedules');

global.config = config;
global.rendererLogger = rendererLogger;
global.images = [];
logger.info('Main app started ...');




// Behalten Sie eine globale Referenz auf das Fensterobjekt.
// Wenn Sie dies nicht tun, wird das Fenster automatisch geschlossen,
// sobald das Objekt dem JavaScript-Garbagekollektor übergeben wird.

let win

function createWindow() {
  // Erstellen des Browser-Fensters.
  win = new BrowserWindow({
    width: 1024,
    height: 600
  })

  win.setFullScreen(config.fullscreen);
  // und Laden der index.html der App.
  win.loadFile('index.html')

  //get instance of webContents for sending messages to the frontend
  const emitter = win.webContents

  //create imageWatchdog and bot
  var imageWatchdog = new imagewatcher(config.imageFolder, config.imageCount, global.images, emitter, logger);
  var bot = new telebot(config.botToken, config.imageFolder, imageWatchdog, logger);

  //generate scheduler, when times for turning monitor off and on
  //are given in the config file
  if (config.toggleMonitor) {
    var scheduler = new schedules(config, logger);
  }

  // Öffnen der DevTools.
  //win.webContents.openDevTools()

  bot.startBot()

  // Ausgegeben, wenn das Fenster geschlossen wird.
  win.on('closed', () => {
    // Dereferenzieren des Fensterobjekts, normalerweise würden Sie Fenster
    // in einem Array speichern, falls Ihre App mehrere Fenster unterstützt.
    // Das ist der Zeitpunkt, an dem Sie das zugehörige Element löschen sollten.
    win = null
  })
}

// Diese Methode wird aufgerufen, wenn Electron mit der
// Initialisierung fertig ist und Browserfenster erschaffen kann.
// Einige APIs können nur nach dem Auftreten dieses Events genutzt werden.
app.on('ready', createWindow)

// Verlassen, wenn alle Fenster geschlossen sind.
app.on('window-all-closed', () => {
  // Unter macOS ist es üblich für Apps und ihre Menu Bar
  // aktiv zu bleiben bis der Nutzer explizit mit Cmd + Q die App beendet.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // Unter macOS ist es üblich ein neues Fenster der App zu erstellen, wenn
  // das Dock Icon angeklickt wird und keine anderen Fenster offen sind.
  if (win === null) {
    createWindow()
  }
})

// In dieser Datei können Sie den Rest des App-spezifischen
// Hauptprozess-Codes einbinden. Sie können den Code auch
// auf mehrere Dateien aufteilen und diese hier einbinden.
