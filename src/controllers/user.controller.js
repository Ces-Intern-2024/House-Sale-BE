const { Created } = require('../core/success.response')
const { userService } = require('../services')

const register = async (req, res) => {
    const result = await userService.register(req.body)
    new Created({
        message: 'Register success!',
        metaData: result
    }).send(res)
}

module.exports = {
    register
}
