const { propertyRepo } = require('../models/repo')

const updatePropertyStatus = async (propertyId) => {
    return propertyRepo.updatePropertyStatus(propertyId)
}

const getAllProperties = async ({ propertyOptions }) => {
    const { validOptions, queries } = await propertyRepo.validatePropertyOptions({ propertyOptions })
    return propertyRepo.getAllPropertiesByOptions({ validOptions, queries })
}

const getProperty = async (propertyId) => {
    return propertyRepo.getProperty(propertyId)
}

const createNewProperty = async ({ propertyOptions, userId, locationId }) => {
    return propertyRepo.createNewProperty({ propertyOptions, userId, locationId })
}

const updateProperty = async ({ propertyId, userId, updatedData }) => {
    return propertyRepo.updateProperty({ propertyId, userId, updatedData })
}

module.exports = {
    updatePropertyStatus,
    getAllProperties,
    getProperty,
    createNewProperty,
    updateProperty
}
