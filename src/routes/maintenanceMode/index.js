const express = require('express')
const { maintenanceController } = require('../../controllers')
const asyncHandler = require('../../middlewares/asyncHandler')

const router = express.Router()

router.get('', asyncHandler(maintenanceController.getMaintenanceMode))

module.exports = router
