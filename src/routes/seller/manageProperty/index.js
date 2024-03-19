const express = require('express')
const asyncHandler = require('../../../middlewares/asyncHandler')
const validate = require('../../../middlewares/validate')
const authentication = require('../../../middlewares/authentication')
const { sellerController } = require('../../../controllers')
const { propertyValidation } = require('../../../validations')

const router = express.Router()

router.use(authentication('Seller'))

router.post('', validate(propertyValidation.createNewProperty), asyncHandler(sellerController.createNewProperty))
router.get('', validate(propertyValidation.getAllProperties), asyncHandler(sellerController.getAllProperties))
router.delete(
    '',
    validate(propertyValidation.deleteListProperties),
    asyncHandler(sellerController.deleteListProperties)
)
router.get('/:propertyId', validate(propertyValidation.getProperty), asyncHandler(sellerController.getProperty))
router.patch('/:propertyId', validate(propertyValidation.updateProperty), asyncHandler(sellerController.updateProperty))
router.patch(
    '/:propertyId/status',
    validate(propertyValidation.updatePropertyStatus),
    asyncHandler(sellerController.updatePropertyStatus)
)

module.exports = router
