const express = require('express')
const asyncHandler = require('../../../middlewares/asyncHandler')
const validate = require('../../../middlewares/validate')
const { adminController } = require('../../../controllers')
const { adminValidation } = require('../../../validations')

const router = express.Router()

router.get('/count-properties-by-feature', asyncHandler(adminController.countPropertiesByFeature))
router.get('/count-properties-by-category', asyncHandler(adminController.countPropertiesByCategory))
router.get(
    '/count-properties-created-by-date',
    validate(adminValidation.report.countPropertiesCreatedByDate),
    asyncHandler(adminController.countPropertiesCreatedByDate)
)

router.get(
    '/count-contacts-by-date',
    validate(adminValidation.report.countContactsByDate),
    asyncHandler(adminController.countContactsByDate)
)

module.exports = router
