const Joi = require('joi')

const report = {
    countPropertiesCreatedByDate: {
        query: Joi.object().required().keys({
            fromDateRange: Joi.date().iso().required(),
            toDateRange: Joi.date().iso().required()
        })
    }
}

module.exports = {
    report
}
