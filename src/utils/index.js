const { BadRequestError } = require('../core/error.response')

const isValidKeyOfModel = async (model, id, errorMessage) => {
    if (!id) {
        return null
    }

    const validEntity = await model.findByPk(id)
    if (!validEntity) {
        throw new BadRequestError(errorMessage)
    }
    return id
}

const transformPropertyData = (property) => {
    const propertyJson = property.toJSON()
    delete propertyJson.userId
    delete propertyJson.featureId
    delete propertyJson.categoryId
    delete propertyJson.locationId
    const propertyImageList = propertyJson.images?.map((image) => image.imageUrl)
    const updatedProperty = { ...propertyJson, images: propertyImageList }
    return updatedProperty
}

const mapAndTransformProperties = (properties) => {
    const updatedProperties = properties.map((property) => transformPropertyData(property))
    return { count: properties.length, properties: updatedProperties }
}

module.exports = {
    isValidKeyOfModel,
    transformPropertyData,
    mapAndTransformProperties
}
