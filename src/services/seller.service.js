const { ROLE_NAME } = require('../core/data.constant')
const { propertyRepo } = require('../models/repo')

/**
 * Archive property of seller by propertyId, sellerId
 * @param {Object} params
 * @param {id} propertyId - id of property
 * @param {id} userId - id of seller
 * @returns {Promise<boolean>}
 */
const deleteProperty = async ({ propertyId, userId }) => {
    return propertyRepo.deleteProperty({ propertyId, userId })
}

/**
 * Update property status of seller by propertyId, sellerId
 * @param {Object} params
 * @param {id} propertyId - id of property
 * @param {id} userId - id of seller
 * @param {string} status - status of property
 * @returns {Promise<boolean>}
 */
const updatePropertyStatus = async ({ propertyId, status, userId }) => {
    return propertyRepo.updatePropertyStatus({ propertyId, status, userId, role: ROLE_NAME.SELLER })
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
    return propertyRepo.updateProperty({ propertyId, userId, updatedData, role: ROLE_NAME.SELLER })
}

/** Get property of seller by propertyId
 * @param {Object} params
 * @param {id} params.propertyId - propertyId
 * @param {id} params.sellerId -sellerId
 * @returns {Promise<Property>}
 */
const getProperty = async ({ propertyId, userId }) => {
    return propertyRepo.getProperty({ propertyId, userId, role: ROLE_NAME.SELLER })
}

/**
 * Get all properties of seller by options: keyword, featureId, categoryId,...
 * @param {Object} params
 * @param {Object} params.options - keyword, featureId, categoryId,...
 * @param {id} params.userId -userId of seller
 * @returns {Promise<Properties>}
 */
const getAllProperties = async ({ options, userId }) => {
    const { validOptions, queries } = await propertyRepo.validatePropertyOptions({
        propertyOptions: options,
        role: ROLE_NAME.SELLER
    })
    return propertyRepo.getAllProperties({ validOptions, queries, userId, role: ROLE_NAME.SELLER })
}

module.exports = {
    deleteProperty,
    updatePropertyStatus,
    updateProperty,
    getProperty,
    getAllProperties
}
