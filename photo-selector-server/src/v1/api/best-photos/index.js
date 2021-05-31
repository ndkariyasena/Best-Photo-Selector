/* Expose all reusable components */
const service = require('./service');

const controller = require('./controller');

const routes = require('./routes');

const database = require('./database');

module.exports = {
  BestPhotosService: service,

  BestPhotosController: controller,

  BestPhotosRoutes: routes,

  BestPhotosDatabase: database,
};
