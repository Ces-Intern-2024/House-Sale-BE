const Joi = require('joi')

const createContact = {
    body: Joi.object().required().keys({
        propertyId: Joi.number().required(),
        sellerId: Joi.number().required(),
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        phone: Joi.string().required(),
        message: Joi.string().required()
    })
}

module.exports = {
    createContact
}
