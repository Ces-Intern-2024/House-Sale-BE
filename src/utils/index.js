const bcrypt = require('bcrypt')
const { BadRequestError } = require('../core/error.response')

const hashPassword = async (password) => {
    const roundsSalt = 10
    return bcrypt.hash(password, roundsSalt)
}

const isValidKeyOfModel = async (model, key, errorMessage) => {
    if (!key) {
        return null
    }

    const validEntity = await model.findByPk(key)
    if (!validEntity) {
        throw new BadRequestError(errorMessage)
    }

    return key
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

const mapAndTransformProperties = ({ propertiesData, page, limit }) => {
    const { count: totalItems, rows: properties } = propertiesData
    const updatedProperties = properties.map((property) => transformPropertyData(property))
    const totalPages = Math.ceil(totalItems / limit)

    return { totalPages, currentPage: page, totalItems, properties: updatedProperties }
}

const getExistingKeysInObject = (object, keys) => {
    return keys.reduce((newObj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key) && Object.keys(object[key]).length > 0) {
            return { ...newObj, [key]: object[key] }
        }

        return newObj
    }, {})
}

module.exports = {
    hashPassword,
    isValidKeyOfModel,
    transformPropertyData,
    mapAndTransformProperties,
    getExistingKeysInObject
}
