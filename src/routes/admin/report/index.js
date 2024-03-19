const express = require('express')
const asyncHandler = require('../../../middlewares/asyncHandler')
const { adminController } = require('../../../controllers')

const router = express.Router()

router.get('/count-properties-by-feature', asyncHandler(adminController.countPropertiesByFeature))

module.exports = router
