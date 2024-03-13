const express = require('express')
const { conversionRateController } = require('../../controllers')
const asyncHandler = require('../../middlewares/asyncHandler')

const router = express.Router()

router.get('', asyncHandler(conversionRateController.getAllConversionRates))

module.exports = router
