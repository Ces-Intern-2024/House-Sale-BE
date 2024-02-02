const Joi = require('joi')

const getDistricts = {
    query: Joi.object().keys({
        provinceCode: Joi.string().required()
    })
}

const getWards = {
    query: Joi.object().keys({
        districtCode: Joi.string().required()
    })
}

module.exports = {
    getWards,
    getDistricts
}
