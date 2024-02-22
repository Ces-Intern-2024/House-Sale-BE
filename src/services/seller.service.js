const { propertyRepo } = require('../models/repo')

/**
 * Delete property of seller by propertyId, sellerId
 * @param {*} param0
 * @param {id} propertyId - id of property
 * @param {id} userId - id of seller
 * @returns {Promise<boolean>}
 */
const deleteProperty = async ({ propertyId, userId }) => {
    return propertyRepo.deleteProperty({ propertyId, userId })
}

/**
 * Update property of seller by sellerId, propertyId
 * @param {Object} params
 * @param {id} params.propertyId
 * @param {id} params.userId - sellerId
 * @param {id} params.updatedData - updated information of property
 * @returns {Promise<boolean>}
 */
const updateProperty = async ({ propertyId, userId, updatedData }) => {
    return propertyRepo.updateProperty({ propertyId, userId, updatedData })
}

/** Get property of seller by propertyId
 * @param {Object} params
 * @param {id} params.propertyId - propertyId
 * @param {id} params.sellerId -sellerId
 * @returns {Promise<Property>}
 */
const getProperty = async ({ propertyId, sellerId }) => {
    return propertyRepo.getPropertyBySeller({ propertyId, userId: sellerId })
}

/**
 * Get all properties of seller by options: keyword, featureId, categoryId,...
 * @param {Object} params
 * @param {Object} params.options - keyword, featureId, categoryId,...
 * @param {id} params.sellerId -userId of seller
 * @returns {Promise<Properties>}
 */
const getAllProperties = async ({ options, sellerId }) => {
    const { validOptions, queries } = await propertyRepo.validatePropertyOptions({ propertyOptions: options })
    return propertyRepo.getAllPropertiesBySellerOptions({ validOptions, queries, sellerId })
}

module.exports = {
    deleteProperty,
    updateProperty,
    getProperty,
    getAllProperties
}
