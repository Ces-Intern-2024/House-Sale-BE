const { ROLE_NAME } = require('../core/data.constant')
const { propertyRepo } = require('../models/repo')

const updatePropertyStatus = async (propertyId) => {
    return propertyRepo.updatePropertyStatus(propertyId)
}

const getAllProperties = async ({ propertyOptions }) => {
    const { validOptions, queries } = await propertyRepo.validatePropertyOptions({
        propertyOptions,
        role: ROLE_NAME.USER
    })
    return propertyRepo.getAllProperties({ validOptions, queries })
}

const getProperty = async (propertyId) => {
    return propertyRepo.getProperty({ propertyId, role: ROLE_NAME.USER })
}

const updateProperty = async ({ propertyId, userId, updatedData }) => {
    return propertyRepo.updateProperty({ propertyId, userId, updatedData })
}

module.exports = {
    updatePropertyStatus,
    getAllProperties,
    getProperty,
    updateProperty
}
