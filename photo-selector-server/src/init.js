const initRoute = (message) => (req, res) => {

  res.status(200).json({

    message: message,

    application: process.env.APP_NAME,

    version: process.env.VERSION
  });
};

module.exports = {

  initRoute,

};