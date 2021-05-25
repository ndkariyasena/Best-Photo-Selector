const service = require('./service');

const controller = require('./controller');

const routes = require('./routes');

module.exports = {
  BestPhotosService: service,

  BestPhotosController: controller,

  BestPhotosRoutes: routes,
};
