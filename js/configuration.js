const fs = require('fs');
const configuration = require ('./defaultConfig');
const defConfPlain = JSON.stringify(configuration)
const configPath = __dirname + '/../config/config.json';
const writeConfigIgnoreKeys = ['phrases'];
const STRINGIFY_SEPARATOR = 2

const prepareUserConfig = (conf, defConf, userConf, key, value) => {
  if (writeConfigIgnoreKeys.indexOf(key) > -1) {
    return;
  }

  if (typeof defConf[key] === 'undefined') {
    userConf[key] = value;
  } else if (Array.isArray(value)) {
    let setArray = (!Array.isArray(defConf[key]) || value.length !== defConf[key].length);
    if (!setArray) {
      for(let i = 0; i < value.length; i++) {
        if (value[i] !== defConf[key][i]) {
            setArray = true;
            break;
        }
      }
    }
    if (setArray) {
      userConf[key] = value;
    }
  } else if (value instanceof Object) {
    userConf[key] = {};
    for (const subKey of Object.keys(value)) {
      // recursive call to update the object
      prepareUserConfig(conf[key], Object.assign({}, defConf[key]), userConf[key], subKey, value[subKey]);
    }
    if (Object.keys(userConf[key]).length === 0) {
      delete userConf[key];
    }
  } else if (defConf[key] !== value) {
    userConf[key] = value;
  }
};


// merge configuration
const mergeConfig = (conf) => {
  /**
   * Set value from mergeConf to destConf
   * @param  {Object} mergeConf [description]
   * @param  {Object} destConf  [description]
   * @param  {string} key       [description]
   */
  const setConfigValue = (mergeConf, destConf, key) => {
    if (typeof destConf[key] !== 'undefined' && mergeConf[key] instanceof Object && !Array.isArray(mergeConf[key])) {
      // process subobject values
      for (const subKey of Object.keys(mergeConf[key])) {
        setConfigValue(mergeConf[key], destConf[key], subKey);
      }
    } else {
      destConf[key] = mergeConf[key];
    }
  };
  // process entries from conf
  for (const key of Object.keys(conf)) {
    setConfigValue(conf, configuration, key);
  }
}

/**
 * Returns the default configuration object
 * @return {Object} default configuration
 */
configuration.getDefaults = () => JSON.parse(defConfPlain);

/**
 * Write from defaulConfig deviating options to the config file
 */
configuration.writeConfig = () => {
  let userConfig = {};
  for (const key of Object.keys(configuration)) {
    prepareUserConfig(configuration, configuration.getDefaults(), userConfig, key, configuration[key])
  }
  fs.writeFileSync(configPath, JSON.stringify(userConfig, null, STRINGIFY_SEPARATOR));
};


//check for old user config
if (fs.existsSync(configPath)) {
  mergeConfig(require(configPath));
} else {
  // convert old configuration file
  const oldConfig = configPath.replace('.json', '.js');
  mergeConfig(require(oldConfig));
  // backup the old config
  fs.renameSync(oldConfig, oldConfig.replace('.js', '.backup.js'));
  // // remove default values
  config.writeConfig();
}

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = configuration;
}
