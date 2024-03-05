const express = require('express')
const { conversionRateController } = require('../../controllers')
const asyncHandler = require('../../middlewares/asyncHandler')
const authentication = require('../../middlewares/authentication')
const validate = require('../../middlewares/validate')
const { conversionRateValidation } = require('../../validations')

const router = express.Router()

router.get('', asyncHandler(conversionRateController.getAllConversionRates))
router.use(authentication('Admin'))
router.post(
    '',
    validate(conversionRateValidation.createConversionRate),
    asyncHandler(conversionRateController.createConversionRate)
)

module.exports = router
