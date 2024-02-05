const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const validate = require('../../middlewares/validate')
const authentication = require('../../middlewares/authentication')
const { sellerController } = require('../../controllers')
const { propertyValidation } = require('../../validations')

const router = express.Router()

router.use(authentication('Seller'))

router.post(
    '/properties',
    validate(propertyValidation.createNewProperty),
    asyncHandler(sellerController.createNewProperty)
)
router.get(
    '/properties',
    validate(propertyValidation.getAllProperties),
    asyncHandler(sellerController.getAllProperties)
)
router.get(
    '/properties/:propertyId',
    validate(propertyValidation.getProperty),
    asyncHandler(sellerController.getProperty)
)

module.exports = router
