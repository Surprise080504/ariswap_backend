const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/front/bid.controller')

router.route('/create').post(controller.create)
router.route('/delete/:bidId').delete(controller.delete)
router.route('/list').get(controller.list)
router.route('/claimableListbyUserId').get(controller.claimableListbyUserId)
router.route('/claimedBid').put(controller.claimedBid)
router.route('/accept').put(controller.accept)

module.exports = router
