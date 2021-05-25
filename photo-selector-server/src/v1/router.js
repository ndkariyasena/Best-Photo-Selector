const express = require('express');

const router = express.Router();

const { initRoute } = require('../init');

const { BestPhotosRoutes } = require('@v1/modules/best-photos');

const init = initRoute( process.env.APP_NAME + ' server v1 API server is working properly');

router.get('/', init);

router.use('/best-photos', BestPhotosRoutes);

module.exports = router;