const express = require('express')
const asyncHandler = require('../../../middlewares/asyncHandler')
const validate = require('../../../middlewares/validate')
const { adminController } = require('../../../controllers')
const { adminValidation } = require('../../../validations')

const router = express.Router()

router.get('', validate(adminValidation.getAllUsers), asyncHandler(adminController.getAllUsers))
router.get('/:userId', validate(adminValidation.getUserById), asyncHandler(adminController.getUserById))
router.delete('/:userId', validate(adminValidation.deleteUserById), asyncHandler(adminController.deleteUserById))
router.patch('/:userId', validate(adminValidation.updateUserById), asyncHandler(adminController.updateUserById))
router.patch(
    '/:userId/active',
    validate(adminValidation.updateUserActiveStatus),
    asyncHandler(adminController.updateUserActiveStatus)
)
router.post(
    '/:userId/reset-password',
    validate(adminValidation.resetUserPassword),
    asyncHandler(adminController.resetUserPassword)
)
module.exports = router
