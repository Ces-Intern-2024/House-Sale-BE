const Joi = require('joi')

const createService = {
    body: Joi.object()
        .required()
        .keys({
            serviceName: Joi.string().required(),
            duration: Joi.number().required().valid(15, 30, 60),
            price: Joi.number().required()
        })
}

module.exports = {
    createService
}
