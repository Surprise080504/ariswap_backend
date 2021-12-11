const express = require('express');
const controller = require('../../../controllers/front/auctions.controller');
const router = express.Router();

router.route('/live').get(controller.live);

module.exports = router;