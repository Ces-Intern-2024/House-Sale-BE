const { propertyRepo } = require('../models/repo')

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
    getAllProperties
}
