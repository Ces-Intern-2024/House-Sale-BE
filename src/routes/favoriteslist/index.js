const express = require('express')
const { favoritesListController } = require('../../controllers')
const asyncHandler = require('../../middlewares/asyncHandler')
const validate = require('../../middlewares/validate')
const { favoritesListValidation } = require('../../validations')
const authentication = require('../../middlewares/authentication')

const router = express.Router()
router.use(authentication())
router.post(
    '',
    validate(favoritesListValidation.updateFavoriteProperty),
    asyncHandler(favoritesListController.updateFavoriteProperty)
)

module.exports = router
