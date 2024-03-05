const Joi = require('joi')

const createConversionRate = {
    body: Joi.object().required().keys({
        currencyFrom: Joi.string().required(),
        currencyTo: Joi.string().required(),
        exchangeRate: Joi.number().required(),
        effectiveDate: Joi.date().required()
    })
}

module.exports = {
    createConversionRate
}
