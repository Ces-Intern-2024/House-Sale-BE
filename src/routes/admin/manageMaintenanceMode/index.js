const express = require('express')
const asyncHandler = require('../../../middlewares/asyncHandler')
const validate = require('../../../middlewares/validate')
const { adminController } = require('../../../controllers')
const { adminValidation } = require('../../../validations')

const router = express.Router()

router.get('', asyncHandler(adminController.getMaintenanceMode))
router.patch(
    '',
    validate(adminValidation.manageMaintenanceMode.updateMaintenanceMode),
    asyncHandler(adminController.updateMaintenanceMode)
)

module.exports = router
