const express = require('express');

const Controller = require('./controller');

const router = express.Router();

// router.route('/')
//   .get(Controller.getBestPhotosOrder)
//   .post(Controller.createBestPhotosOrder)
//   .put(Controller.updateBestPhotosOrder);

router.route('/user/:userId')
  .get(Controller.getPhotoCollectionsForUser);

router.route('/collection/:collectionId')
  .get(Controller.getPhotoCollectionByCollectionId);

module.exports = router;
