const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const validate = require('../../middlewares/validate')
const authentication = require('../../middlewares/authentication')
const { userController } = require('../../controllers')
const { userValidation } = require('../../validations')

const router = express.Router()

router.post('/register', validate(userValidation.register), asyncHandler(userController.register))
router.post('/login', validate(userValidation.login), asyncHandler(userController.login))
router.post('/refreshTokens', validate(userValidation.refreshToken), asyncHandler(userController.refreshTokens))
router.use(authentication)
router.get('/checkAuth', (req, res) => {
    res.send('Check Auth Success!')
})
router.post('/logout', validate(userValidation.logout), asyncHandler(userController.logout))
router.post('/change-password', validate(userValidation.changePassword), asyncHandler(userController.changePassword))
router.post(
    '/change-phone-number',
    validate(userValidation.changePhoneNumber),
    asyncHandler(userController.changePhoneNumber)
)
router.get('/profile', asyncHandler(userController.getProfile))
router.post('/update-avatar', validate(userValidation.updateAvatar), asyncHandler(userController.updateAvatar))

module.exports = router
