const express = require('express')
const { categoryController } = require('../../controllers')
const asyncHandler = require('../../middlewares/asyncHandler')

const router = express.Router()

router.get('', asyncHandler(categoryController.getAllCategories))

module.exports = router
