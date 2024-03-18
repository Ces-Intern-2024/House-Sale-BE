const express = require('express')
const asyncHandler = require('../../../middlewares/asyncHandler')
const validate = require('../../../middlewares/validate')
const { adminController } = require('../../../controllers')
const { adminValidation } = require('../../../validations')

const router = express.Router()

router.get(
    '',
    validate(adminValidation.manageProperty.getAllProperties),
    asyncHandler(adminController.getAllProperties)
)
router.delete(
    '',
    validate(adminValidation.manageProperty.deleteListProperties),
    asyncHandler(adminController.deleteListProperties)
)
router.get(
    '/:propertyId',
    validate(adminValidation.manageProperty.getProperty),
    asyncHandler(adminController.getProperty)
)
router.patch(
    '/disable',
    validate(adminValidation.manageProperty.disableListProperties),
    asyncHandler(adminController.disableListProperties)
)

module.exports = router
