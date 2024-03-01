const { propertyRepo } = require('../models/repo')

const deleteProperty = async ({ propertyId }) => {
    return propertyRepo.deleteProperty({ propertyId })
}

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
    deleteProperty,
    updatePropertyStatus,
    getAllProperties,
    getProperty,
    createNewProperty,
    updateProperty
}
