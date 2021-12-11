const express = require('express')
const router = express.Router()

const controller = require('../../../controllers/front/fixedPriceTokens.controller')
router.route('/addFixedToken').post(controller.addNftToken)
router.route('/getFixedtokens').get(controller.getNftTokens)
router.route('/nftToken/:id').get(controller.getNftToken)
module.exports = router