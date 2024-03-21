const { ROLE_NAME } = require('../core/data.constant')
const { propertyRepo } = require('../models/repo')

/**
 * Get all properties by property options
 * @param {Object} params
 * @param {Object} params.propertyOptions - Property options to filter properties
 * @returns {Promise<[Property]>} - List of properties
 */
const getAllProperties = async ({ propertyOptions }) => {
    const { validOptions, queries } = await propertyRepo.validatePropertyOptions({
        propertyOptions,
        role: ROLE_NAME.USER
    })
    return propertyRepo.getAllProperties({ validOptions, queries })
}

/**
 * Get property by propertyId
 * @param {id} propertyId
 * @returns {Promise<Property>} - Property
 */
const getProperty = async (propertyId) => {
    return propertyRepo.getProperty({ propertyId, role: ROLE_NAME.USER })
}

/**
 * Update property by propertyId and userId
 * @param {Object} params
 * @param {id} params.propertyId - Property id
 * @param {id} params.userId - User id
 * @param {Object} params.updatedData - Updated data
 * @returns {Promise<Boolean>}
 */
const updateProperty = async ({ propertyId, userId, updatedData }) => {
    return propertyRepo.updateProperty({ propertyId, userId, updatedData })
}

/**
 * Get all available property count by feature and category
 *@returns {Promise<[{...Feature, totalCount: number, categories: [...Category, count]}]>} - List of available properties count by feature and category
 */
const getAllAvailablePropertyCountByFeatureAndCategory = async () => {
    return propertyRepo.getAllAvailablePropertyCountByFeatureAndCategory()
}

module.exports = {
    getAllAvailablePropertyCountByFeatureAndCategory,
    getAllProperties,
    getProperty,
    updateProperty
}
