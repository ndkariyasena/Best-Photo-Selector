const swaggerJSDoc = require('swagger-jsdoc');

const { Swagger } = require('@ComConfig');

const { Definition, Apis } = Swagger;

const ConfigSwagger = (AppVersion) => {

  const options = {
    swaggerDefinition: Definition(AppVersion),
    apis: [
      ...Apis(AppVersion),
    ]
  };

  const swaggerSpec = swaggerJSDoc(options);

  const getAPIJson = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    res.send(swaggerSpec);
  };

  return { swaggerSpec, getAPIJson };
};

module.exports = ConfigSwagger;