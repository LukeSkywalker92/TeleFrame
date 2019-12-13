const fs = require('fs');

module.exports = (config) => {
  // initialize localized texts
  let configPath = __dirname + '/../config/';
  let langPath =  configPath + 'i18n/';
  let langfile = configPath + 'texts.js';
  let currentTextConfig = {};
  // Does users language file 'config/tests.js' exist?
  if (!fs.existsSync(langfile)) {
    //  load the language file definied in config.language
    if (config.language && fs.existsSync(langPath + config.language + '.js')) {
      langFile = langPath + config.languageFile;
    } else {
      // fallback - load the language file for the current environment setting
      // in addition, always merge the current configuration last in order
      // to keep the texts of the user settings.
      let envLang = process.env.LANG;
      // including country - 'en_US'
      langFile =  langPath + `${envLang.substr(0, envLang.indexOf('.'))}.js`;
      if(!fs.existsSync(langFile)) {
        // whithout country - 'en'
        langFile =  langPath + `${envLang.substr(0, envLang.indexOf('_'))}.js`;
      }
      // keep the texts defined in the current config
      Object.assign(currentTextConfig, config);
    }
  }
  // load the language
  Object.assign(config, langFile, currentTextConfig);
};
