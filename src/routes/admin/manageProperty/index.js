const express = require('express')
const asyncHandler = require('../../../middlewares/asyncHandler')
const validate = require('../../../middlewares/validate')
const { adminController } = require('../../../controllers')
const { adminValidation } = require('../../../validations')

const router = express.Router()

router.get('', validate(adminValidation.getAllProperties), asyncHandler(adminController.getAllProperties))
router.get('/:propertyId', validate(adminValidation.getProperty), asyncHandler(adminController.getProperty))
router.patch(
    '/:propertyId/active',
    validate(adminValidation.updatePropertyStatus),
    asyncHandler(adminController.updatePropertyStatus)
)
module.exports = router
