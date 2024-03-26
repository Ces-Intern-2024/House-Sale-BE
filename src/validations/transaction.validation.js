const Joi = require('joi')

const depositCredit = {
    body: Joi.object().required().keys({
        amountInDollars: Joi.number().required(),
        amountInCredits: Joi.number().required(),
        exchangeRate: Joi.number().required(),
        description: Joi.string().required()
    })
}

const getAllDepositTransactions = {
    query: Joi.object().keys({
        fromDateRange: Joi.date().iso(),
        toDateRange: Joi.date().iso(),
        page: Joi.number(),
        limit: Joi.number(),
        orderBy: Joi.string().valid('createdAt'),
        sortBy: Joi.string().valid('ASC', 'asc', 'DESC', 'desc')
    })
}

const getAllRentServiceTransactions = {
    query: Joi.object().keys({
        fromDateRange: Joi.date().iso(),
        toDateRange: Joi.date().iso(),
        page: Joi.number(),
        limit: Joi.number(),
        orderBy: Joi.string().valid('createdAt'),
        sortBy: Joi.string().valid('ASC', 'asc', 'DESC', 'desc')
    })
}

module.exports = {
    getAllRentServiceTransactions,
    getAllDepositTransactions,
    depositCredit
}
