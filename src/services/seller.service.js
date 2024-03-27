const { ROLE_NAME, TRANSACTION, REPORT } = require('../core/data.constant')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')
const db = require('../models')
const {
    propertyRepo,
    locationRepo,
    userRepo,
    serviceRepo,
    imageRepo,
    transactionRepo,
    contactRepo
} = require('../models/repo')
const { checkBalance } = require('../models/repo/transaction.repo')
const { calculateExpiresDate } = require('../utils')

/**
 * Count amount deposited in each type by date in credits and dollars and total amount deposited in each type
 * @param {Object} params
 * @param {id} params.userId
 * @param {string} params.fromDateRange
 * @param {string} params.toDateRange
 * @returns {Promise<{totalAmountInDollars: number, totalAmountInCredits: number, data: Array.<{dateReport: string, amountInDollars: number, amountInCredits: number}>}>}
 */
const getTotalAmountDepositedByDate = async (query) => {
    const { userId, fromDateRange, toDateRange } = query
    await userRepo.findUserById(userId)
    return transactionRepo.getTotalAmountDepositedByDate({ userId, fromDateRange, toDateRange })
}

/**
 * Get total amount deposited in credits and dollars by seller
 * @param {id} userId
 * @returns {Promise<Object>} - Total amount deposited in credits and total amount deposited in dollars by seller
 */
const getTotalAmountDepositedBySeller = async (userId) => {
    await userRepo.findUserById(userId)
    return transactionRepo.getTotalAmountDeposited(userId)
}

/**
 * Count contacts created by date of seller
 * @param {Object} query  - query object contains userId, fromDateRange, toDateRange
 * @returns {Promise<Object>} - List number of contacts by date and total number of contacts
 */
const countContactsByDate = async (query) => {
    const {
        userId,
        fromDateRange = REPORT.DEFAULT_DATE_RANGE.FROM(),
        toDateRange = REPORT.DEFAULT_DATE_RANGE.TO()
    } = query
    await userRepo.findUserById(userId)
    return contactRepo.countContactsByDate({ userId, fromDateRange, toDateRange })
}

/**
 * Count properties created by date of seller
 * @param {Object} query  - query object contains userId, fromDateRange, toDateRange
 * @returns {Promise<Object>} - List number of properties created by date and total number of properties
 */
const countPropertiesCreatedByDate = async (query) => {
    const {
        userId,
        fromDateRange = REPORT.DEFAULT_DATE_RANGE.FROM(),
        toDateRange = REPORT.DEFAULT_DATE_RANGE.TO()
    } = query
    await userRepo.findUserById(userId)
    return propertyRepo.countPropertiesCreatedByDate({ userId, fromDateRange, toDateRange })
}

/**
 * Count properties of seller by category
 * @param {id} userId
 * @returns {Promise<Object>} - List number of properties by category
 */
const countPropertiesByCategory = async (userId) => {
    await userRepo.findUserById(userId)
    return propertyRepo.countPropertiesByCategory(userId)
}

/**
 * Count properties of seller by feature
 * @param {id} userId
 * @returns {Promise<Object>} - List number of properties by feature
 */
const countPropertiesByFeature = async (userId) => {
    await userRepo.findUserById(userId)
    return propertyRepo.countPropertiesByFeature(userId)
}

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
        if (error instanceof db.Sequelize.ValidationError) {
            throw new BadRequestError(error.errors[0].message)
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
const deleteListProperties = async ({ propertyId, userId }) => {
    const propertyIds = propertyId.split(',')
    return propertyRepo.deleteListProperties({ propertyIds, userId })
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
    getTotalAmountDepositedByDate,
    getTotalAmountDepositedBySeller,
    countContactsByDate,
    countPropertiesCreatedByDate,
    countPropertiesByCategory,
    countPropertiesByFeature,
    createProperty,
    deleteListProperties,
    updatePropertyStatus,
    updateProperty,
    getProperty,
    getAllProperties
}
