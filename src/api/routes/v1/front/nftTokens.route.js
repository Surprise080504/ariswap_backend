const express = require('express')
const router = express.Router()

const controller = require('../../../controllers/front/NftTokens.controller')
router.route('/addToken').post(controller.addNftToken)
router.route('/tokens').get(controller.getNftTokens)

module.exports = router