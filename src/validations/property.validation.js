const Joi = require('joi')

const getAllProperties = {
    query: Joi.object().keys({
        keyword: Joi.string(),
        featureId: Joi.number(),
        categoryId: Joi.number(),
        provinceCode: Joi.string(),
        districtCode: Joi.string(),
        wardCode: Joi.string(),
        priceFrom: Joi.number(),
        priceTo: Joi.number(),
        landAreaFrom: Joi.number(),
        landAreaTo: Joi.number(),
        areaOfUseFrom: Joi.number(),
        areaOfUseTo: Joi.number(),
        numberOfFloorFrom: Joi.number(),
        numberOfFloorTo: Joi.number(),
        numberOfBedRoomFrom: Joi.number(),
        numberOfBedRoomTo: Joi.number(),
        numberOfToiletFrom: Joi.number(),
        numberOfToiletTo: Joi.number(),
        page: Joi.number(),
        limit: Joi.number(),
        orderBy: Joi.string().valid('Price', 'price'),
        sortBy: Joi.string().valid('ASC', 'asc', 'DESC', 'desc')
    })
}

const getProperty = {
    params: Joi.object().keys({
        propertyId: Joi.number().required()
    })
}

module.exports = {
    getProperty,
    getAllProperties
}
