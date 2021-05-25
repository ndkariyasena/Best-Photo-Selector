const swaggerJSDoc = require('swagger-jsdoc');

const swaggerUi = require('swagger-ui-express');

const { Swagger, Configs, Database } = require('@config');

const { Definition, Apis } = Swagger;

const { DB_NAME } = process.env;

const options = {
  swaggerDefinition: Definition('V1'),
  apis: [
    ...Apis['V1'].map(api => `./src/v1/modules/${api}/swagger/*.yaml`),
    './src/v1/*.yaml',
    './src/v1/swagger/*.yaml',
  ]
};

/**
 * Enable CORS option
 *
 * @param {*} app
 */
const enableCorsOptions = (app) => {

  const cors = require('cors');

  const whitelist = Configs.ALLOWED_DOMAINS;

  const corsOptions = {
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  };

  app.use(cors(corsOptions));

};

const swaggerSpec = swaggerJSDoc(options);

const getAPIJson = (req, res) => {

  res.setHeader('Content-Type', 'application/json');

  res.send(swaggerSpec);
};

module.exports = (app) => {

  app.get('/v1/swagger.json', getAPIJson);

  app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  enableCorsOptions(app);

  Database.connect(DB_NAME);
};