const express = require('express')
const { propertyController } = require('../../controllers')
const asyncHandler = require('../../middlewares/asyncHandler')

const router = express.Router()

router.get('/search', asyncHandler(propertyController.getPropertiesByKeyword))
router.get('/:propertyId', asyncHandler(propertyController.getProperty))
router.get('', asyncHandler(propertyController.getAllProperties))

module.exports = router
