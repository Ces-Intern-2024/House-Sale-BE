const Joi = require('joi')
const { password } = require('./custom.validation')

const register = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        fullName: Joi.string().required(),
        phone: Joi.string().required(),
        roleId: Joi.number().required(),
        provinceCode: Joi.string().required(),
        districtCode: Joi.string().required(),
        wardCode: Joi.string().required(),
        street: Joi.string().required(),
        address: Joi.string()
    })
}

const login = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password)
    })
}

const logout = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required()
    })
}

module.exports = {
    register,
    login,
    logout
}
