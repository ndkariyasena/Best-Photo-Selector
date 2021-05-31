/* Expose all reusable components */
const service = require('./service');

const controller = require('./controller');

const routes = require('./routes');

module.exports = {
  PhotoGalleryService: service,

  PhotoGalleryController: controller,

  PhotoGalleryRoutes: routes,
};
