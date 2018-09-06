const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = createLogger({
  format: combine(
    label({ label: 'Main' }),
    timestamp(),
    format.colorize(),
    myFormat
  ),
  transports: [new transports.Console()]
});

const rendererLogger = createLogger({
  format: combine(
    label({ label: 'Renderer' }),
    timestamp(),
    format.colorize(),
    myFormat
  ),
  transports: [new transports.Console()]
});

module.exports = {
  logger,
  rendererLogger
}
