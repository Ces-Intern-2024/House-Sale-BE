const Joi = require('joi')
const { password } = require('./custom.validation')

const register = {
    body: Joi.object()
        .required()
        .keys({
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
    body: Joi.object()
        .required()
        .keys({
            email: Joi.string().required().email(),
            password: Joi.string().required().custom(password)
        })
}

const logout = {
    body: Joi.object().required().keys({
        refreshToken: Joi.string().required()
    })
}

const refreshToken = {
    body: Joi.object().required().keys({
        refreshToken: Joi.string().required()
    })
}

const changePassword = {
    body: Joi.object().keys({
        currentPassword: Joi.string().required().custom(password),
        newPassword: Joi.string().required().custom(password)
    })
}

const changePhoneNumber = {
    body: Joi.object()
        .required()
        .keys({
            newPhoneNumber: Joi.string()
                .regex(/^[0-9]{10}$/)
                .messages({ 'string.pattern.base': `Phone number must have 10 digits.` })
                .required()
        })
}

const updateAvatar = {
    body: Joi.object().required().keys({
        imageUrl: Joi.string().required()
    })
}

module.exports = {
    register,
    login,
    logout,
    refreshToken,
    changePassword,
    changePhoneNumber,
    updateAvatar
}
