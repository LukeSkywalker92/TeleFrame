const langDefault = 'en';
const langPath = __dirname + '/../config/i18n/bot/';
const botPhrases = {};

const {MenuTemplate, MenuMiddleware, deleteMenuFromContext} = require('telegraf-inline-menu')

botPhrases[langDefault] = require(langPath + langDefault);


const menu = new MenuTemplate(() => 'Configuration-Menu');

menu.toggle('whitelistChats', 'whitelistChats', {
  set: (_, newState) => {
    if (newState) {
      config.whitelistChats = config.whitelistAdmins;
    } else {
      config.whitelistChats = [];
    }
    config.writeConfig();
    // Update the menu afterwards
    return true
  },
  isSet: () => config.whitelistChats.length > 0,
  joinLastRow: false
})


menu.toggle('botReply', 'botReply', {
  set: (_, newState) => {
    config.botReply = newState;
    config.writeConfig();
    // Update the menu afterwards
    return true
  },
  isSet: () => config.botReply,
  joinLastRow: false
})

menu.toggle('showVideos', 'showVideos', {
  set: (_, newState) => {
    config.showVideos = newState;
    config.writeConfig();
    // Update the menu afterwards
    return true
  },
  isSet: () => config.showVideos,
  joinLastRow: true
})

menu.toggle('playVideoAudio', 'playVideoAudio', {
  set: (_, newState) => {
    config.playVideoAudio = newState;
    config.writeConfig();
    // Update the menu afterwards
    return true
  },
  isSet: () => config.playVideoAudio,
  joinLastRow: false
})

menu.toggle('randomOrder', 'randomOrder', {
  set: (_, newState) => {
    config.randomOrder = newState;
    config.writeConfig();
    // Update the menu afterwards
    return true
  },
  isSet: () => config.randomOrder,
  joinLastRow: true
})

menu.toggle('autoDeleteImages', 'autoDeleteImages', {
  set: (_, newState) => {
    config.autoDeleteImages = newState;
    config.writeConfig();
    // Update the menu afterwards
    return true
  },
  isSet: () => config.autoDeleteImages,
  joinLastRow: false
})

menu.toggle('showSender', 'showSender', {
  set: (_, newState) => {
    config.showSender = newState;
    config.writeConfig();
    // Update the menu afterwards
    return true
  },
  isSet: () => config.showSender,
  joinLastRow: true
})

menu.toggle('showCaption', 'showCaption', {
  set: (_, newState) => {
    config.showCaption = newState;
    config.writeConfig();
    // Update the menu afterwards
    return true
  },
  isSet: () => config.showCaption,
  joinLastRow: false
})

menu.toggle('useFullscreenForCaptionAndSender', 'useFullscreenForCaptionAndSender', {
  set: (_, newState) => {
    config.useFullscreenForCaptionAndSender = newState;
    config.writeConfig();
    // Update the menu afterwards
    return true
  },
  isSet: () => config.useFullscreenForCaptionAndSender,
  joinLastRow: true
})

menu.interact('Exit', 'unique', {
  do: async context => {
    await deleteMenuFromContext(context);
    return false;
  }
})



/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = menu;
}
