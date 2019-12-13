const fs = require('fs');

module.exports = (config) => {
  // initialize localized texts
  const configPath = __dirname + '/../config/';
  const langPath =  configPath + 'i18n/';
  let langFile = configPath + 'texts.js';
  let currentTextConfig = {};
  // Does users language file 'config/tests.js' exist?
  if (!fs.existsSync(langFile)) {
    //  load the language file definied in config.language
    if (typeof config.language && fs.existsSync(langPath + config.language + '.js')) {
      langFile = langPath + config.language + '.js';
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
        if(!fs.existsSync(langFile)) {
          langFile = null;
        }
      }
      // keep the texts defined in the current config
      Object.assign(currentTextConfig, config);
    }
  }
  // load the language
  if (langFile) {
    Object.assign(config, require(langFile), currentTextConfig);
  }
};
