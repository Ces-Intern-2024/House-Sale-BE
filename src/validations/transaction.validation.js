const Joi = require('joi')

const depositCredit = {
    body: Joi.object().required().keys({
        amount: Joi.number().required(),
        description: Joi.string().required()
    })
}

const getAllDepositTransactions = {
    query: Joi.object().keys({
        fromDateRange: Joi.date().iso(),
        toDateRange: Joi.date().iso()
    })
}

const getAllRentServiceTransactions = {
    query: Joi.object().keys({
        fromDateRange: Joi.date().iso(),
        toDateRange: Joi.date().iso()
    })
}

module.exports = {
    getAllRentServiceTransactions,
    getAllDepositTransactions,
    depositCredit
}
