const { propertyRepo } = require('../models/repo')

/**
 * Get property by seller
 * @param {id} propertyId
 * @returns {Promise<Property>}
 */
const getProperty = async ({ propertyId, sellerId }) => {
    const options = { propertyId, userId: sellerId }
    return propertyRepo.getPropertyBySellerOptions(options)
}

/**
 * Get all properties of seller by options: keyword, featureId, categoryId,...
 * @param {Object} params
 * @param {Object} params.options - keyword, featureId, categoryId,...
 * @param {id} params.sellerId -userId of seller
 * @returns {Promise<Properties>}
 */
const getAllProperties = async ({ options, sellerId }) => {
    const { validOptions, queries } = await propertyRepo.validatePropertyOptions(options)
    return propertyRepo.getAllPropertiesBySellerOptions({ validOptions, queries, sellerId })
}

module.exports = {
    getProperty,
    getAllProperties
}
