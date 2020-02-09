// TeleFrame install script

const fs = require('fs');

// set addon_control.sh executable
fs.chmodSync(`${__dirname}/addon_control.sh`, 0755);
