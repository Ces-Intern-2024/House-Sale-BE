const { Created, OK } = require('../core/success.response')
const { userService, emailService } = require('../services')

const upgradeToSeller = async (req, res) => {
    const userId = req.user?.userId
    const { email } = await userService.fulFillSellerInformation({ userId, information: req.body })
    await emailService.sendConfirmUpgradeSellerEmail({ userId, email })
    new OK({
        message: 'Your upgrade request has been sent! Please check your email to confirm'
    }).send(res)
}

const loginWithGoogle = async (req, res) => {
    const result = await userService.loginWithGoogle(req.body)
    new OK({
        message: 'Login with google success!',
        metaData: result
    }).send(res)
}

const verifyEmail = async (req, res) => {
    const { userId, code } = req.params
    const redirectWithMessage = (message) => {
        return `
            <script>
                alert('${message} Click OK to redirect to home page!');
                window.location.href = 'https://house-sale-three.vercel.app/home';
            </script>
        `
    }

    try {
        await userService.verifyEmail({ userId, code })
        res.send(redirectWithMessage('Your email had been verified successfully!'))
    } catch (error) {
        res.send(redirectWithMessage(error.message || 'There was an error verifying your email!'))
    }
}

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
    const { newSeller: userInfo, tokens } = await userService.registerSeller(req.body)
    const { email, userId } = userInfo
    await emailService.sendVerificationEmail({
        userId,
        email
    })
    new Created({
        message: 'Registration success for new seller! Please check your email to verify your account!',
        metaData: { newSeller: userInfo, tokens }
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
