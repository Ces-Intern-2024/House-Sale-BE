const express = require('express')
const asyncHandler = require('../../../middlewares/asyncHandler')
const validate = require('../../../middlewares/validate')
const { adminController } = require('../../../controllers')
const { adminValidation } = require('../../../validations')

const router = express.Router()

router.get('', asyncHandler(adminController.getAllServices))
router.post('', validate(adminValidation.manageService.createService), asyncHandler(adminController.createService))
router.delete('', validate(adminValidation.manageService.deleteService), asyncHandler(adminController.deleteService))
router.patch(
    '/:serviceId',
    validate(adminValidation.manageService.updateService),
    asyncHandler(adminController.updateService)
)

module.exports = router
