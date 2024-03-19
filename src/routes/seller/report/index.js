const express = require('express')
const asyncHandler = require('../../../middlewares/asyncHandler')
const { sellerController } = require('../../../controllers')

const router = express.Router()

router.get('/count-properties-by-feature', asyncHandler(sellerController.countPropertiesByFeature))

module.exports = router
