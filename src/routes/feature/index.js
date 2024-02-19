const express = require('express')
const { featureController } = require('../../controllers')
const asyncHandler = require('../../middlewares/asyncHandler')

const router = express.Router()

router.get('', asyncHandler(featureController.getAllFeatures))

module.exports = router
