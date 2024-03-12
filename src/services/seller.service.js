const { ROLE_NAME, TRANSACTION } = require('../core/data.constant')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')
const db = require('../models')
const { propertyRepo, locationRepo, userRepo, serviceRepo, imageRepo, transactionRepo } = require('../models/repo')
const { checkBalance } = require('../models/repo/transaction.repo')
const { calculateExpiresDate } = require('../utils')

/**
 *  Create property of seller by sellerId
 * @param {Object} params
 * @param {Object} params.propertyData - property information
 * @param {id} params.userId - sellerId
 * @param {Object} params.option - option to rent service (serviceId, amount)
 * @returns {Promise<boolean>}
 */
const createProperty = async ({ propertyData, userId, option }) => {
    const transaction = await db.sequelize.transaction()
    try {
        const { provinceCode, districtCode, wardCode, street, address, images, ...propertyOptions } = propertyData
        const user = await userRepo.findUserById(userId)
        const { serviceId } = option
        const { balance } = user
        const { price, duration } = await serviceRepo.findService(serviceId)
        checkBalance(balance, price)
        const expiresAt = calculateExpiresDate(duration)

        const newLocation = await locationRepo.createLocation(
            { provinceCode, districtCode, wardCode, street, address },
            transaction
        )
        const newProperty = await propertyRepo.createProperty(
            { propertyOptions, locationId: newLocation.locationId, userId, expiresAt },
            transaction
        )
        await imageRepo.savedPropertyImages({ images, propertyId: newProperty.propertyId }, transaction)
        await transactionRepo.createRentServiceTransactionAndUpdateUserBalance(
            {
                userId,
                amount: price,
                balance,
                serviceId,
                description: TRANSACTION.EXPENSE_DESC.CREATE_NEW_PROPERTY(newProperty.propertyId)
            },
            transaction
        )

        await transaction.commit()
    } catch (error) {
        await transaction.rollback()
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.CREATE)
    }
}

/**
 * Delete property of seller by propertyId, sellerId
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
const updatePropertyStatus = async ({ propertyId, status, userId, serviceId }) => {
    return propertyRepo.updatePropertyStatus({ propertyId, status, userId, serviceId })
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
    createProperty,
    deleteProperty,
    updatePropertyStatus,
    updateProperty,
    getProperty,
    getAllProperties
}
