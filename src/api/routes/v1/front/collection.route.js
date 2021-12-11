const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/front/collection.controller')
const { collectionUpload } = require('../../../utils/upload')

router.route('/create').post(collectionUpload, controller.create)
router.route('/edit').put(collectionUpload, controller.edit)
router.route('/delete/:collectionId').delete(controller.delete)
router.route('/get/:collectionId').get(controller.get)
router.route('/list').get(controller.list)

module.exports = router
