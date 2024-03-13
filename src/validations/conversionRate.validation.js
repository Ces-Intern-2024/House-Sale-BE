const Joi = require('joi')

const updateConversionRate = {
    params: Joi.object().required().keys({
        conversionRateId: Joi.string().required()
    }),
    body: Joi.object()
        .required()
        .keys({
            newExchangeRate: Joi.number().greater(0).required()
        })
}

const createConversionRate = {
    body: Joi.object()
        .required()
        .keys({
            currencyFrom: Joi.string().required().valid('USD').messages({
                'any.only': 'Currency from must be USD'
            }),
            currencyTo: Joi.string().required().valid('Credit').messages({
                'any.only': 'Currency to must be Credit'
            }),
            exchangeRate: Joi.number().greater(0).required()
        })
}

module.exports = {
    updateConversionRate,
    createConversionRate
}
