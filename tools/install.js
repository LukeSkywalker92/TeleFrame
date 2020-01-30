// TeleFrame install script

const {exec} = require('child_process');

const cmd = `chmod 755 ${__dirname}/addon_control.sh >/dev/null 2>&1) || echo chmod failed for ${__dirname}/addon_control.sh`;
exec(cmd);
