const winston = require('winston');

// Set up logging formats
const logFormat = winston.format.printf(({ timestamp, level, message, ...metadata }) => {
  let log = `${timestamp} [${level}]: ${message} `;
  if (metadata) {
    log += JSON.stringify(metadata);
  }
  return log;
});

// Create a logger instance with various transports (console, file, etc.)
const logger = winston.createLogger({
  level: 'info', // default log level, you can adjust based on your needs
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    logFormat
  ),
  transports: [
    // Console logging for development
    new winston.transports.Console({
      level: 'debug', // Log level for console output
      format: winston.format.combine(
        winston.format.colorize(), // Add colors to log levels for easier reading
        winston.format.simple()
      ),
    }),
    // File logging for production or persistent logs
    new winston.transports.File({
      filename: 'logs/app.log',  // Logs are stored in 'logs/app.log'
      level: 'info', // File will log info and above
    }),
  ],
  exceptionHandlers: [
    // Ensure uncaught exceptions are logged to file
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    // Ensure unhandled promise rejections are logged to file
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

// Example for logging different types of logs
logger.debug('This is a debug message');
logger.info('This is an info message');
logger.warn('This is a warning');
logger.error('This is an error message');

// Ensure uncaught exceptions and unhandled promise rejections are logged
process.on('unhandledRejection', (ex) => {
  throw ex; // Will be caught by the rejection handler
});

process.on('uncaughtException', (ex) => {
  logger.error('Uncaught Exception: ', ex);
  process.exit(1); // Exit the process after logging the error
});

module.exports = logger;
