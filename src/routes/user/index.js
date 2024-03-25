const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const validate = require('../../middlewares/validate')
const authentication = require('../../middlewares/authentication')
const { userController } = require('../../controllers')
const { userValidation } = require('../../validations')
const checkMaintenanceMode = require('../../middlewares/checkMaintenanceMode')

const router = express.Router()

router.post(
    '/login-with-google',
    validate(userValidation.loginWithGoogle),
    asyncHandler(userController.loginWithGoogle)
)
router.post('/register-user', validate(userValidation.registerUser), asyncHandler(userController.registerUser))
router.post('/register-seller', validate(userValidation.registerSeller), asyncHandler(userController.registerSeller))
router.post('/login', validate(userValidation.login), asyncHandler(userController.login))
router.post('/refreshTokens', validate(userValidation.refreshToken), asyncHandler(userController.refreshTokens))
router.get(
    '/verify-email/:userId/:code',
    validate(userValidation.verifyEmail),
    asyncHandler(userController.verifyEmail)
)
router.use(authentication())
router.get('/checkAuth', (req, res) => {
    res.send('Check Auth Success!')
})
router.post('/logout', validate(userValidation.logout), asyncHandler(userController.logout))
router.use(checkMaintenanceMode)
router.post('/change-password', validate(userValidation.changePassword), asyncHandler(userController.changePassword))
router.get('/profile', asyncHandler(userController.getProfile))
router.patch('/profile', validate(userValidation.updateProfile), asyncHandler(userController.updateProfile))
router.post('/update-avatar', validate(userValidation.updateAvatar), asyncHandler(userController.updateAvatar))
router.post('/upgrade-seller', validate(userValidation.upgradeToSeller), asyncHandler(userController.upgradeToSeller))

module.exports = router
