const Joi = require('joi')

const resetUserPassword = {
    params: Joi.object().required().keys({
        userId: Joi.number().required()
    })
}

const updateUserById = {
    params: Joi.object().required().keys({
        userId: Joi.number().required()
    }),
    body: Joi.object().keys({
        roleId: Joi.number().valid(1, 2, 3).messages({
            'number.base': 'Role ID must be a number',
            'any.only': 'Role ID must be one of 1, 2, 3'
        }),
        fullName: Joi.string().messages({
            'string.base': 'Full name must be a string',
            'string.empty': 'Full name is required'
        }),
        phone: Joi.string()
            .regex(/^[0-9]{10}$/)
            .messages({
                'string.base': 'Phone number must have 10 digits.'
            }),
        isEmailVerified: Joi.boolean(),
        avatar: Joi.string().messages({
            'string.base': 'Avatar must be a string'
        }),
        provinceCode: Joi.string(),
        districtCode: Joi.string(),
        wardCode: Joi.string(),
        street: Joi.string(),
        address: Joi.string()
    })
}

const updateUserActiveStatus = {
    params: Joi.object().required().keys({
        userId: Joi.number().required()
    })
}
const deleteUserById = {
    params: Joi.object().required().keys({
        userId: Joi.number().required()
    })
}

const getUserById = {
    params: Joi.object().required().keys({
        userId: Joi.number().required()
    })
}

const getAllUsers = {
    query: Joi.object().keys({
        roleId: Joi.number().valid(1, 2, 3).messages({
            'number.base': 'Role ID must be a number',
            'any.only': 'Role ID must be one of 1, 2, 3'
        }),
        email: Joi.string(),
        limit: Joi.number().integer().min(1).message('Limit must be a number and greater than 0').default(10),
        page: Joi.number().integer().min(1).message('Page must be a number and greater than 0').default(1),
        orderBy: Joi.string().valid('createdAt', 'updatedAt', 'email', 'fullName'),
        sortBy: Joi.string().valid('asc', 'desc')
    })
}

module.exports = {
    resetUserPassword,
    updateUserById,
    updateUserActiveStatus,
    deleteUserById,
    getUserById,
    getAllUsers
}
