const express = require('express')
const { propertyController } = require('../../controllers')
const asyncHandler = require('../../middlewares/asyncHandler')

const router = express.Router()

router.get('', asyncHandler(propertyController.getAllProperties))
router.get('/:propertyId', asyncHandler(propertyController.getProperty))

module.exports = router
