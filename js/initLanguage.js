const fs = require('fs');

module.exports = (config, configPath = __dirname + '/../config') => {
  // initialize localized texts
  const langPath =  configPath + '/i18n/';
  const defaultLangFile = langPath + 'en.js';
  let langFile = configPath + 'texts.js';
  let mergeCurrentConfigTexts = false;
  // Does users language file 'config/tests.js' exist?
  if (!fs.existsSync(langFile)) {
    //  load the language file definied in config.language
    if (typeof config.language === 'string' && fs.existsSync(langPath + config.language + '.js')) {
      langFile = langPath + config.language + '.js';
    } else {
      // fallback - load the language file for the current environment setting
      // in addition, always merge the current configuration last in order
      // to keep the texts of the user settings.
      let envLang = process.env.LANG || ''; // fallback to empty string to support development under windows
      // including country - 'en_US'
      langFile = langPath + `${envLang.substr(0, envLang.indexOf('.'))}.js`;
      if(!fs.existsSync(langFile)) {
        // whithout country - 'en'
        envLang = envLang.substr(0, envLang.indexOf('_'));
        langFile =  langPath + `${envLang}.js`;
        if(!fs.existsSync(langFile)) {
          langFile = defaultLangFile;
        }
      }
      // keep the texts defined in the current config
      mergeCurrentConfigTexts = true;
    }
  }
  // load the language
  config.phrases = Object.assign({}, require(defaultLangFile), (langFile !== defaultLangFile ? require(langFile) : {}));

  // remove unused text configuration options
  for (const phraseKey in Object.keys(config.phrases)) {
    if (mergeCurrentConfigTexts && typeof config[phraseKey] === 'string') {
      config.phrases[phraseKey] = config[phraseKey];
    }
    if (config.voiceReply && typeof config.voiceReply[phraseKey] === 'string') {
      if (mergeCurrentConfigTexts) {
        config.phrases[phraseKey] = config.voiceReply[phraseKey];
      }
      delete config.voiceReply[phraseKey];
    }
    delete config[phraseKey];
  }
};
