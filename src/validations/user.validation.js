const Joi = require('joi')
const { password } = require('./custom.validation')

const registerUser = {
    body: Joi.object()
        .required()
        .keys({
            email: Joi.string().required().email(),
            password: Joi.string().required().custom(password)
        })
}

const registerSeller = {
    body: Joi.object()
        .required()
        .keys({
            email: Joi.string().required().email(),
            password: Joi.string().required().custom(password),
            fullName: Joi.string().required(),
            phone: Joi.string().required(),
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

const updateProfile = {
    body: Joi.object().keys({
        fullName: Joi.string(),
        phone: Joi.string()
            .regex(/^[0-9]{10}$/)
            .messages({ 'string.pattern.base': `Phone number must have 10 digits.` }),
        provinceCode: Joi.string(),
        districtCode: Joi.string(),
        wardCode: Joi.string(),
        street: Joi.string(),
        address: Joi.string()
    })
}

const updateAvatar = {
    body: Joi.object().required().keys({
        imageUrl: Joi.string().required()
    })
}

const verifyEmail = {
    params: Joi.object().keys({
        userId: Joi.string().required(),
        code: Joi.string().required()
    })
}

const loginWithGoogle = {
    body: Joi.object().required().keys({
        email: Joi.string().required().email(),
        fullName: Joi.string().required(),
        accessToken: Joi.string().required()
    })
}

module.exports = {
    registerUser,
    registerSeller,
    login,
    logout,
    refreshToken,
    changePassword,
    updateProfile,
    updateAvatar,
    verifyEmail,
    loginWithGoogle
}
