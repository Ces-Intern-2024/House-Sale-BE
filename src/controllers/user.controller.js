const { Created, OK } = require('../core/success.response')
const { userService } = require('../services')

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
    login,
    register
}
