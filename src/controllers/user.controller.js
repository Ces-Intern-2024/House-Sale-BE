const { Created, OK } = require('../core/success.response')
const { userService } = require('../services')

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

const register = async (req, res) => {
    const result = await userService.register(req.body)
    new Created({
        message: 'Register success!',
        metaData: result
    }).send(res)
}

module.exports = {
    logout,
    login,
    register
}
