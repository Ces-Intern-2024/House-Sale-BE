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

module.exports = router
