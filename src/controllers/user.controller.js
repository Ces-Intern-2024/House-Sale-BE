const { Created, OK } = require('../core/success.response')
const { userService } = require('../services')

const updateAvatar = async (req, res) => {
    const userId = req.user?.userId
    const { imageUrl } = req.body
    await userService.updateAvatar({ userId, imageUrl })
    new OK({
        message: 'Your avatar had been changed successfully!'
    }).send(res)
}

const updateProfile = async (req, res) => {
    const userId = req.user?.userId
    const information = req.body
    await userService.updateProfile({ userId, information })
    new OK({
        message: 'Your profile had been changed successfully!'
    }).send(res)
}

const getProfile = async (req, res) => {
    const userId = req.user?.userId
    const profile = await userService.getProfile(userId)
    new OK({
        message: 'Get your profile successfully!',
        metaData: profile
    }).send(res)
}

const changePassword = async (req, res) => {
    const userId = req.user?.userId
    const { currentPassword, newPassword } = req.body
    await userService.changePassword({ userId, currentPassword, newPassword })
    new OK({
        message: 'Your password has been changed successfully!'
    }).send(res)
}

const refreshTokens = async (req, res) => {
    const { refreshToken } = req.body
    const newTokens = await userService.refreshTokens(refreshToken)
    new Created({
        message: 'Create new accessToken success!',
        metaData: newTokens
    }).send(res)
}

const logout = async (req, res) => {
    const userId = req.user?.userId
    const { refreshToken } = req.body
    await userService.logout({ userId, refreshToken })
    new OK({
        message: 'Logout success!'
    }).send(res)
}

const login = async (req, res) => {
    const result = await userService.login(req.body)
    new OK({
        message: 'Login success!',
        metaData: result
    }).send(res)
}

const registerSeller = async (req, res) => {
    const result = await userService.registerSeller(req.body)
    new Created({
        message: 'Registration success for new seller!',
        metaData: result
    }).send(res)
}

const registerUser = async (req, res) => {
    const result = await userService.registerUser(req.body)
    new Created({
        message: 'Registration success for new user!',
        metaData: result
    }).send(res)
}

module.exports = {
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
