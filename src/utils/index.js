const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const { BadRequestError } = require('../core/error.response')

const ROUNDS_SALT = 10

const generateVerifyEmailCode = async (userId) => {
    const uniqueCode = uuidv4() + userId
    const hashVerificationCode = await bcrypt.hash(uniqueCode, ROUNDS_SALT)

    return { uniqueCode, hashVerificationCode }
}

const hashPassword = async (password) => {
    return bcrypt.hash(password, ROUNDS_SALT)
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

    return propertyJson
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
    generateVerifyEmailCode,
    hashPassword,
    isValidKeyOfModel,
    transformPropertyData,
    mapAndTransformProperties,
    getExistingKeysInObject
}
