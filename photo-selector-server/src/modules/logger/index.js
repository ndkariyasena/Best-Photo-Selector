const { transports, format, createLogger } = require('winston');

const { Winston } = require('@ComConfig');

const LogFiles = Winston.files.map((file) => new transports.File(file));

const logger = new createLogger({
  transports: [
    ...LogFiles,
    new transports.Console(Winston.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
});

// logger.setLevels({
//   debug:0,
//   info: 1,
//   silly:2,
//   warn: 3,
//   error:4,
// });

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize({ all: true }),
      format.simple()
    )
  }));
}

module.exports = logger;