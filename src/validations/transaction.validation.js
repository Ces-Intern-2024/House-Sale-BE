const Joi = require('joi')

const deposit = {
    body: Joi.object().required().keys({
        amount: Joi.number().required()
    })
}

module.exports = {
    deposit
}
