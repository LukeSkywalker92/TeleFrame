// TeleFrame install script

const fs = require('fs');
const {execSync} = require('child_process');

// configure git to ignore filemode changes
execSync('git config core.filemode false');
// set addon_control.sh executable
fs.chmodSync(`${__dirname}/addon_control.sh`, 0755);
