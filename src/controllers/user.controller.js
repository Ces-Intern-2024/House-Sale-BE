const { Created, OK } = require('../core/success.response')
const { userService, emailService } = require('../services')
const { SUCCESS_MESSAGES, ERROR_MESSAGES, VERIFY_EMAIL_RESPONSE_MESSAGE } = require('../core/message.constant')

const upgradeToSeller = async (req, res) => {
    const userId = req.user?.userId
    const { email } = await userService.fulFillSellerInformation({ userId, information: req.body })
    await emailService.sendConfirmUpgradeSellerEmail({ userId, email })
    new OK({
        message: SUCCESS_MESSAGES.USER.UPGRADE_TO_SELLER
    }).send(res)
}

const loginWithGoogle = async (req, res) => {
    const result = await userService.loginWithGoogle(req.body)
    new OK({
        message: SUCCESS_MESSAGES.USER.LOGIN_GOOGLE,
        metaData: result
    }).send(res)
}

const verifyEmail = async (req, res) => {
    const { userId, code } = req.params
    const redirectWithMessage = (message) => {
        return VERIFY_EMAIL_RESPONSE_MESSAGE(message)
    }

    try {
        await userService.verifyEmail({ userId, code })
        res.send(redirectWithMessage(SUCCESS_MESSAGES.USER.VERIFY_EMAIL_SUCCESS))
    } catch (error) {
        res.send(redirectWithMessage(ERROR_MESSAGES.USER.FAILED_TO_VERIFY_EMAIL))
    }
}

const updateAvatar = async (req, res) => {
    const userId = req.user?.userId
    const { imageUrl } = req.body
    await userService.updateAvatar({ userId, imageUrl })
    new OK({
        message: SUCCESS_MESSAGES.USER.UPDATE_AVATAR
    }).send(res)
}

const updateProfile = async (req, res) => {
    const userId = req.user?.userId
    const userBody = req.body
    await userService.updateProfile({ userId, userBody })
    new OK({
        message: SUCCESS_MESSAGES.USER.UPDATE_PROFILE
    }).send(res)
}

const getProfile = async (req, res) => {
    const userId = req.user?.userId
    const profile = await userService.getProfile(userId)
    new OK({
        message: SUCCESS_MESSAGES.USER.GET_PROFILE,
        metaData: profile
    }).send(res)
}

const changePassword = async (req, res) => {
    const userId = req.user?.userId
    const { currentPassword, newPassword } = req.body
    await userService.changePassword({ userId, currentPassword, newPassword })
    new OK({
        message: SUCCESS_MESSAGES.USER.CHANGE_PASSWORD
    }).send(res)
}

const refreshTokens = async (req, res) => {
    const { refreshToken } = req.body
    const newTokens = await userService.refreshTokens(refreshToken)
    new Created({
        message: SUCCESS_MESSAGES.USER.REFRESH_TOKENS,
        metaData: newTokens
    }).send(res)
}

const logout = async (req, res) => {
    const userId = req.user?.userId
    const { refreshToken } = req.body
    await userService.logout({ userId, refreshToken })
    new OK({
        message: SUCCESS_MESSAGES.USER.LOGOUT
    }).send(res)
}

const login = async (req, res) => {
    const result = await userService.login(req.body)
    new OK({
        message: SUCCESS_MESSAGES.USER.LOGIN,
        metaData: result
    }).send(res)
}

const registerSeller = async (req, res) => {
    const newSeller = await userService.registerSeller(req.body)
    const { email, userId } = newSeller
    await emailService.sendVerificationEmail({
        userId,
        email
    })
    new Created({
        message: SUCCESS_MESSAGES.USER.REGISTER_SELLER
    }).send(res)
}

const registerUser = async (req, res) => {
    await userService.registerUser(req.body)
    new Created({
        message: SUCCESS_MESSAGES.USER.REGISTER_USER
    }).send(res)
}

module.exports = {
    upgradeToSeller,
    loginWithGoogle,
    verifyEmail,
    updateAvatar,
    updateProfile,
    getProfile,
    changePassword,
    refreshTokens,
    logout,
    login,
    registerSeller,
    registerUser
}
