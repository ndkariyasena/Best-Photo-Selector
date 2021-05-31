/* V1 version handling root point */
const express = require('express');

const fs = require('fs');

const swaggerUi = require('swagger-ui-express');

const { SwaggerModule, CorsModule } = require('@ComModules/');

const { Redis } = require('@ComConfig');

const { Configs, Database } = require('@v1Config');

const { getPublicDir } = require('@v1/helpers.js');

const { LoggerModule } = require('@ComModules');

const APP_VERSION = 'V1';

/* Swagger configurations */
const { swaggerSpec, getAPIJson } = SwaggerModule(APP_VERSION);

/* Middleware function for basic logging purpose */
const loggerMiddleware = (req, res, next) => {
  LoggerModule.info(req.originalUrl);
  next();
};

const v1App = (app) => {
  /* Appending; */

  /* CORS configurations */
  CorsModule(app, Configs.ALLOWED_DOMAINS);
  
  /* Logging middleware */
  app.use(loggerMiddleware);

  /* Swagger endpoints */
  app.get(`/${APP_VERSION.toLowerCase()}/swagger.json`, getAPIJson);

  app.use(`/${APP_VERSION.toLowerCase()}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  /* Static folder declaration */
  const publicDir = getPublicDir();

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

  app.use(express.static(publicDir));

  /* Redis server configurations */
  Redis.createRedisClient(Configs.REDIS);

  /* Database configurations */
  Database.connect();
};

module.exports = v1App;