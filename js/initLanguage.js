const fs = require('fs');

module.exports = (config) => {
  // initialize localized texts
  let configPath = __dirname + '/../config/';
  if (fs.existsSync(configPath + 'texts.js')) {
    //  load the users language file
    Object.assign(config, require(configPath + 'texts.js'));
  } else if (config.languageFile && fs.existsSync(configPath + config.languageFile)) {
    //  load the language file definied in config.languageFile
    Object.assign(config, require(configPath + config.languageFile));
  } else {
    // fallback - load the language file for the current environment setting
    // in addition, always merge the current configuration last in order
    // to keep the texts of the user settings.
    let envLang = process.env.LANG;
    // including country - 'en_US'
    let langFile = configPath + `i18n/${envLang.substr(0, envLang.indexOf('.'))}.js`;
    if(fs.existsSync(langFile)) {
      Object.assign(config, require(langFile), config);
    } else {
      // whithout country - 'en'
      langFile = configPath + `i18n/${envLang.substr(0, envLang.indexOf('_'))}.js`;
      if(fs.existsSync(langFile)) {
        Object.assign(config, require(langFile), config);
      }
    }
  }
};
