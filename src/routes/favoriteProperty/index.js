const express = require('express')
const { favoritePropertyController } = require('../../controllers')
const asyncHandler = require('../../middlewares/asyncHandler')
const validate = require('../../middlewares/validate')
const { favoritePropertyValidation } = require('../../validations')
const authentication = require('../../middlewares/authentication')

const router = express.Router()
router.use(authentication())
router.post(
    '',
    validate(favoritePropertyValidation.updateFavoriteProperty),
    asyncHandler(favoritePropertyController.updateFavoriteProperty)
)
router.get('', asyncHandler(favoritePropertyController.getFavoritesList))

module.exports = router
