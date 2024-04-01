const express = require('express')
const asyncHandler = require('../../../middlewares/asyncHandler')
const validate = require('../../../middlewares/validate')
const { sellerController } = require('../../../controllers')
const { sellerValidation } = require('../../../validations')

const router = express.Router()

router.get('/count-properties-by-feature', asyncHandler(sellerController.countPropertiesByFeature))
router.get('/count-properties-by-category', asyncHandler(sellerController.countPropertiesByCategory))
router.get(
    '/count-properties-created-by-date',
    validate(sellerValidation.report.countPropertiesCreatedByDate),
    asyncHandler(sellerController.countPropertiesCreatedByDate)
)
router.get(
    '/count-contacts-by-date',
    validate(sellerValidation.report.countContactsByDate),
    asyncHandler(sellerController.countContactsByDate)
)
router.get('/total-amount-deposited', asyncHandler(sellerController.getTotalAmountDepositedBySeller))
router.get(
    '/total-amount-deposited-by-date',
    validate(sellerValidation.report.getTotalAmountDepositedByDate),
    asyncHandler(sellerController.getTotalAmountDepositedByDate)
)
router.get('/total-credits-used', asyncHandler(sellerController.getTotalCreditsUsedBySeller))
router.get(
    '/total-credits-used-by-date',
    validate(sellerValidation.report.getTotalCreditsUsedByDate),
    asyncHandler(sellerController.getTotalCreditsUsedByDate)
)
router.get('/total-contacts', asyncHandler(sellerController.getTotalContactsBySeller))
module.exports = router
