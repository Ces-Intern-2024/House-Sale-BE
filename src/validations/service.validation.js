const Joi = require('joi')

const createService = {
    body: Joi.object().required().keys({
        serviceName: Joi.string().required(),
        price: Joi.number().required()
    })
}

module.exports = {
    createService
}
