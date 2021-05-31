/* cSpell:ignore maxsize */
const fs = require('fs');

const path = require('path');

const dirPath = path.join(process.cwd(), '/logs');

if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);

const CommonFileConfigs = {
  handleExceptions: true,
  json: true,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
  colorize: true,
};

const OPTIONS = {
  files: [
    {
      level: 'error',
      filename: `${dirPath}/error.log`,
      ...CommonFileConfigs,
    },
    {
      level: 'warn',
      filename: `${dirPath}/warn.log`,
      ...CommonFileConfigs,
    },
    {
      level: 'info',
      filename: `${dirPath}/info.log`,
      ...CommonFileConfigs,
    }
  ],
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

module.exports = OPTIONS;