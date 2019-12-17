// requires
const _ = require('lodash')

// module variables
// readFiles
const userConfig = require('./config.json')
const defaultConfig = require('./defaultConfig.js')

// merge Files
const config = _.merge(defaultConfig, userConfig)
console.log(config)

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== 'undefined') {
  module.exports = config
}
