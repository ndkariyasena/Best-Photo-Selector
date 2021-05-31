/* Handle all V1 routes */
const express = require('express');

const router = express.Router();

const { initRoute } = require('../init');

const { BestPhotosRoutes } = require('@v1/api/best-photos');

const { PhotoGalleryRoutes } = require('@v1/api/photo-gallery');

const init = initRoute( process.env.APP_NAME + ' server v1 API server is working properly');

/* V1 init route */
router.get('/', init);

router.use('/best-photos', BestPhotosRoutes);

router.use('/photo-gallery', PhotoGalleryRoutes);

module.exports = router;