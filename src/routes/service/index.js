const express = require('express')
const { serviceController } = require('../../controllers')
const asyncHandler = require('../../middlewares/asyncHandler')

const router = express.Router()

router.get('', asyncHandler(serviceController.getAllServices))

module.exports = router
