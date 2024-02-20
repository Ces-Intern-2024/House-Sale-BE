const Joi = require('joi')

const updateFavoriteProperty = {
    body: Joi.object().required().keys({
        propertyId: Joi.number().required()
    })
}

module.exports = {
    updateFavoriteProperty
}
