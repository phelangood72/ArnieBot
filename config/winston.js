var winston = require('winston');

// In other files use var winston = require('./config/winston') and place this file in the app's config/ directory

var options = {
  console: {
    level: 'silly',
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.simple()
    )
  }
};

var logger = new winston.createLogger({
  transports: [
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
});

module.exports = logger;
