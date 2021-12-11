const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/front/faq.controller')

router.route('/list').get(controller.list)

module.exports = router