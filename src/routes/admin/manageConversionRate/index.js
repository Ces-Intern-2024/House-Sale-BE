const express = require('express')
const asyncHandler = require('../../../middlewares/asyncHandler')
const validate = require('../../../middlewares/validate')
const { adminController } = require('../../../controllers')
const { adminValidation } = require('../../../validations')

const router = express.Router()

router.get('', asyncHandler(adminController.getAllConversionRates))
router.post(
    '',
    validate(adminValidation.manageConversionRate.createConversionRate),
    asyncHandler(adminController.createConversionRate)
)
router.patch(
    '/:conversionRateId',
    validate(adminValidation.manageConversionRate.updateConversionRate),
    asyncHandler(adminController.updateConversionRate)
)
router.delete(
    '/:conversionRateId',
    validate(adminValidation.manageConversionRate.deleteConversionRate),
    asyncHandler(adminController.deleteConversionRate)
)

module.exports = router
