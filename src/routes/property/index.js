const express = require('express')
const { propertyController } = require('../../controllers')
const asyncHandler = require('../../middlewares/asyncHandler')
const validate = require('../../middlewares/validate')
const { propertyValidation } = require('../../validations')

const router = express.Router()

router.get('', validate(propertyValidation.getAllProperties), asyncHandler(propertyController.getAllProperties))
router.get(
    '/count-available-property',
    asyncHandler(propertyController.getAllAvailablePropertyCountByFeatureAndCategory)
)
router.get('/max-price', asyncHandler(propertyController.getMaxPropertyPrice))
router.get('/:propertyId', validate(propertyValidation.getProperty), asyncHandler(propertyController.getProperty))

module.exports = router
