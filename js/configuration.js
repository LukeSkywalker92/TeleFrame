const fs = require('fs');
const configuration = require ('./defaultConfig');
const defConfPlain = JSON.stringify(configuration)
const configPath = __dirname + '/../config/config.json';
const writeConfigIgnoreKeys = ['phrases'];
const STRINGIFY_SEPARATOR = 2

/**
 * Prepares the user configuration for writing
 * @param  {Object} conf     current config object
 * @param  {Object} defConf  default config object
 * @param  {Object} userConf uner configuration to write
 * @param  {string} key      Object key where to write the value
 * @param  {(string|string[]|number|number[]|boolean|Object)} value the value to write
 */
const prepareUserConfig = (conf, defConf, userConf, key, value) => {
  if (writeConfigIgnoreKeys.indexOf(key) > -1) {
    return;
  }

  if (typeof defConf[key] === 'undefined') {
    userConf[key] = value;
  } else if (Array.isArray(value)) {
    if ((!Array.isArray(defConf[key])
      || value.length !== defConf[key].length
      || JSON.stringify(defConf[key]) !== JSON.stringify(value))) {

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


/**
 * Merge the given configuration object to the current configuration
 * @param  {[type]} conf [description]
 * @return {[type]}      [description]
 */
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
 * @return {Object} default Configuration
 */
configuration.getDefaults = () => JSON.parse(defConfPlain);

/**
 * Write from defaultConfig deviating options to the config file
 * Notice: Arrays are always copied completely
 */
configuration.writeConfig = () => {
  let userConfig = {};
  for (const key of Object.keys(configuration)) {
    prepareUserConfig(configuration, configuration.getDefaults(), userConfig, key, configuration[key])
  }
  fs.writeFileSync(configPath, JSON.stringify(userConfig, null, STRINGIFY_SEPARATOR));
};

if (fs.existsSync(configPath)) {
  mergeConfig(require(configPath));
} else {
  // convert old configuration file
  const oldConfigPath = configPath.replace('.json', '.js');
  const oldConfig = require(oldConfigPath);
  // clean config: remove text constants
  [
    'newPhotoMessage', 'newVideoMessage', 'deleteConfirmText',
    'deleteCancelText', 'shutdownMessage', 'shutdownConfirmText',
    'shutdownCancelText', 'rebootMessage', 'rebootConfirmText', 'rebootCancelText'
  ].forEach(key => delete oldConfig[key]);
  // clean config: remove voiceReply text constants
  [
    'recordingMessageTitle', 'recordingPreMessage', 'recordingPostMessage',
    'recordingDone', 'recordingError'
  ].forEach(key => delete oldConfig.voiceReply[key]);

  mergeConfig(oldConfig);
  // backup the old config
  fs.renameSync(oldConfigPath, oldConfigPath.replace('.js', '.backup.js'));
  // // remove default values
  configuration.writeConfig();
}

// load the screen switch configuration
const screen = require(__dirname + '/../' + configuration.screenConfig);

// load the phrases
require('./initLanguage')(configuration);

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = {
    config: configuration,
    screen: screen
  };
}
