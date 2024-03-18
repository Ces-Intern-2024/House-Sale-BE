const express = require('express')
const asyncHandler = require('../../../middlewares/asyncHandler')
const validate = require('../../../middlewares/validate')
const { adminController } = require('../../../controllers')
const { adminValidation } = require('../../../validations')

const router = express.Router()

router.get('', validate(adminValidation.manageUser.getAllUsers), asyncHandler(adminController.getAllUsers))
router.get('/:userId', validate(adminValidation.manageUser.getUserById), asyncHandler(adminController.getUserById))
router.delete('', validate(adminValidation.manageUser.deleteListUsers), asyncHandler(adminController.deleteListUsers))
router.patch(
    '/:userId',
    validate(adminValidation.manageUser.updateUserById),
    asyncHandler(adminController.updateUserById)
)
router.patch(
    '/:userId/active',
    validate(adminValidation.manageUser.updateUserActiveStatus),
    asyncHandler(adminController.updateUserActiveStatus)
)
router.post(
    '/:userId/reset-password',
    validate(adminValidation.manageUser.resetUserPassword),
    asyncHandler(adminController.resetUserPassword)
)
module.exports = router
