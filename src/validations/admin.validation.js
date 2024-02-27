const Joi = require('joi')

const getUserById = {
    params: Joi.object().keys({
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
    getUserById,
    getAllUsers
}
