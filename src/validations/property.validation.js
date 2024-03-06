const Joi = require('joi')

const getAllProperties = {
    query: Joi.object().keys({
        keyword: Joi.string(),
        featureId: Joi.string().pattern(/^\d+(,\d+)*$/),
        categoryId: Joi.string().pattern(/^\d+(,\d+)*$/),
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
        orderBy: Joi.string().valid('price', 'createdAt'),
        sortBy: Joi.string().valid('ASC', 'asc', 'DESC', 'desc')
    })
}

const getProperty = {
    params: Joi.object().required().keys({
        propertyId: Joi.number().required()
    })
}

const createNewProperty = {
    body: Joi.object()
        .required()
        .keys({
            name: Joi.string().required(),
            code: Joi.string().required(),
            featureId: Joi.number().required(),
            categoryId: Joi.number().required(),
            provinceCode: Joi.string().required(),
            districtCode: Joi.string().required(),
            wardCode: Joi.string().required(),
            street: Joi.string().required(),
            address: Joi.string().required(),
            landArea: Joi.number().required(),
            areaOfUse: Joi.number().required(),
            numberOfFloor: Joi.number().required(),
            numberOfBedRoom: Joi.number().required(),
            numberOfToilet: Joi.number().required(),
            price: Joi.number().required(),
            currencyCode: Joi.string().required(),
            direction: Joi.string(),
            description: Joi.string(),
            images: Joi.array().items(Joi.string().required()).required()
        })
}

const updateProperty = {
    params: Joi.object().required().keys({
        propertyId: Joi.number().required()
    }),
    body: Joi.object().keys({
        name: Joi.string(),
        code: Joi.string(),
        landArea: Joi.number(),
        areaOfUse: Joi.number(),
        price: Joi.number(),
        direction: Joi.string(),
        description: Joi.string()
    })
}

const updatePropertyStatus = {
    params: Joi.object().required().keys({
        propertyId: Joi.number().required()
    }),
    body: Joi.object().keys({
        status: Joi.string().valid('Available', 'Unavailable').required()
    })
}

const deleteProperty = {
    params: Joi.object().required().keys({
        propertyId: Joi.number().required()
    })
}

module.exports = {
    updatePropertyStatus,
    deleteProperty,
    updateProperty,
    createNewProperty,
    getProperty,
    getAllProperties
}
