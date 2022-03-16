const { createLogger, format, transports } = require('winston');

// Set default log level for file and console transports
const logFileLevel = process.env.NODEAPP_LOG_FILE_LEVEL || 'error';
const logConsoleLevel = process.env.NODEAPP_LOG_CONSOLE_LEVEL || 'debug';

// Set log file path
const logFilePath = process.env.NODEAPP_LOG_FILE_PATH || './nodeapp.log';

// Create a format without color for file transport
const fileFormat = format.combine(
  format.timestamp(),
  format.printf((info) => {
    const { timestamp, level, message } = info;
    return `${timestamp.slice(0, 19).replace('T', ' ')} ${level}: ${JSON.stringify(message)}`;
  }),
);

// Create a format with color for console transport
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.printf((info) => {
    const { timestamp, level, message } = info;
    return `${timestamp.slice(0, 19).replace('T', ' ')} [${level}]: ${JSON.stringify(message)}`;
  }),
);

// Create a logger with file transport
const logger = createLogger({
  format: fileFormat,
  level: logFileLevel,
  transports: [
    new transports.File({ filename: logFilePath, handleExceptions: true, handleRejections: true })
  ],
  silent: process.argv.indexOf('--silent') >= 0,
  exitOnError: false
});

// If the environment not production, add console transport
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    level: logConsoleLevel,
    format: consoleFormat
  }));
}

module.exports = {
  logger
};
