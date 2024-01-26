const express = require('express')
const { propertyController } = require('../../controllers')
const asyncHandler = require('../../middlewares/asyncHandler')
const validate = require('../../middlewares/validate')
const { propertyValidation } = require('../../validations')

const router = express.Router()

router.get('/:propertyId', validate(propertyValidation.getProperty), asyncHandler(propertyController.getProperty))
router.get('', validate(propertyValidation.getAllProperties), asyncHandler(propertyController.getAllProperties))

module.exports = router
