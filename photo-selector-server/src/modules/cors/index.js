const cors = require('cors');

const enableCorsOptions = (app, whitelist = [], option = {}) => {

  const corsOptions = {
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        if( process.env.NODE_ENV === 'development' ) callback(null, true);
        else callback(new Error('Not allowed by CORS'));
      }
    },
    ...option,
  };

  app.use(cors(corsOptions));

};

module.exports = enableCorsOptions;