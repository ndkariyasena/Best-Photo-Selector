const express = require('express');

const Controller = require('./controller');

const router = express.Router();

router.route('/')
  .get(Controller.getBestPhotosOrder)
  .post(Controller.createBestPhotosOrder)
  .put(Controller.updateBestPhotosOrder);

router.route('/user/:userId')
  .get(Controller.getAllBestPhotosOrderForUser);

router.route('/order/:orderId')
  .get(Controller.getAllBestPhotosOrderById);

router.route('/is-orders/:userId')
  .get(Controller.checkPhotoOrdersForUser);

module.exports = router;
