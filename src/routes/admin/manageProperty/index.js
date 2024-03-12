const express = require('express')
const asyncHandler = require('../../../middlewares/asyncHandler')
const validate = require('../../../middlewares/validate')
const { adminController } = require('../../../controllers')
const { adminValidation } = require('../../../validations')

const router = express.Router()

router.get('', validate(adminValidation.getAllProperties), asyncHandler(adminController.getAllProperties))
router.get('/:propertyId', validate(adminValidation.getProperty), asyncHandler(adminController.getProperty))
router.delete('/:propertyId', validate(adminValidation.deleteProperty), asyncHandler(adminController.deleteProperty))
router.patch(
    '/disable',
    validate(adminValidation.disableListProperties),
    asyncHandler(adminController.disableListProperties)
)

module.exports = router
