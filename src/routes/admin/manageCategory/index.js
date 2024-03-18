const express = require('express')
const asyncHandler = require('../../../middlewares/asyncHandler')
const validate = require('../../../middlewares/validate')
const { adminController } = require('../../../controllers')
const { adminValidation } = require('../../../validations')

const router = express.Router()

router.get('', asyncHandler(adminController.getAllCategories))
router.post('', validate(adminValidation.manageCategory.createCategory), asyncHandler(adminController.createCategory))
router.patch(
    '/:categoryId',
    validate(adminValidation.manageCategory.updateCategory),
    asyncHandler(adminController.updateCategory)
)
router.delete(
    '/:categoryId',
    validate(adminValidation.manageCategory.deleteCategory),
    asyncHandler(adminController.deleteCategory)
)

module.exports = router
