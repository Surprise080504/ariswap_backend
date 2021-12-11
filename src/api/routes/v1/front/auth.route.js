const express = require('express');
const controller = require('../../../controllers/front/auth.controller');
const router = express.Router();

router.route('/register').post(controller.register);
router.route('/login').post(controller.login);


module.exports = router;