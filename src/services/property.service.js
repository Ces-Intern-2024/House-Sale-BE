const { propertyRepo } = require('../models/repo')

const getAllProperties = async (options) => {
    const { validOptions, queries } = await propertyRepo.validatePropertyOptions(options)
    return propertyRepo.getAllPropertiesByOptions({ validOptions, queries })
}

const getProperty = async (propertyId) => {
    const options = { propertyId }
    return propertyRepo.getPropertyByOptions(options)
}

const createNewProperty = async ({ propertyOptions, userId, locationId }) => {
    return propertyRepo.createNewProperty({ propertyOptions, userId, locationId })
}

module.exports = {
    getAllProperties,
    getProperty,
    createNewProperty
}
