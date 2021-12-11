const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/front/offer.controller')

router.route('/create').post(controller.create)
router.route('/delete/:offerId').delete(controller.delete)
router.route('/list').get(controller.list)
router.route('/accept').put(controller.accept)

module.exports = router