const { ROLE_NAME, TRANSACTION } = require('../core/data.constant')
const { userRepo, propertyRepo, transactionRepo } = require('../models/repo')

/**
 * Deposit credit to user balance by admin
 * @param {Object} params
 * @param {id} params.userId - the id of user to deposit
 * @param {number} params.amount - the amount of deposit
 * @returns {Promise<Object>} - the new deposit and current balance of user
 */
const depositUserBalance = async ({ userId, amount }) => {
    return transactionRepo.depositCredit({ userId, info: { amount, description: TRANSACTION.DEPOSIT_BY_ADMIN_DESC } })
}

/**
 * Get all rent service transactions by admin
 * @param {Object} query - the query from request contains userId, fromDateRange, toDateRange, page, limit, orderBy, sortBy
 * @returns {Promise<RentServiceTransactions>} - the list of rent service transactions
 */
const getAllRentServiceTransactions = async (query) => {
    return transactionRepo.getAllRentServiceTransactions(query)
}

/**
 * Get all deposit transactions
 * @param {Object} query - the query from request contains userId, fromDateRange, toDateRange, page, limit, orderBy, sortBy
 * @returns {Promise<Transactions>} - the list of deposit transactions
 */
const getAllDepositTransactions = async (query) => {
    return transactionRepo.getAllDepositTransactions(query)
}

/**
 * Permanently delete property by propertyId
 * @param {id} propertyId - id of property
 * @returns {Promise<boolean>}
 */
const deleteProperty = async ({ propertyId }) => {
    return propertyRepo.deleteProperty({ propertyId })
}

/**
 * Update property status by propertyId
 * @param {Object} params
 * @param {id} propertyId - id of property
 * @param {string} status - status of property
 * @returns {Promise<boolean>}
 */
const updatePropertyStatus = async ({ propertyId, status }) => {
    return propertyRepo.updatePropertyStatus({ propertyId, status, role: ROLE_NAME.ADMIN })
}

/** Get property by propertyId
 * @param {id} propertyId - propertyId
 * @returns {Promise<Property>}
 */
const getProperty = async (propertyId) => {
    return propertyRepo.getProperty({ propertyId, role: ROLE_NAME.ADMIN })
}

/**
 * Get all properties by options: keyword, featureId, categoryId,...
 * @param {Object} params
 * @param {Object} params.options - keyword, featureId, categoryId,...
 * @returns {Promise<Properties>}
 */
const getAllProperties = async ({ propertyOptions }) => {
    const { validOptions, queries } = await propertyRepo.validatePropertyOptions({
        propertyOptions,
        role: ROLE_NAME.ADMIN
    })
    return propertyRepo.getAllProperties({ validOptions, queries, role: ROLE_NAME.ADMIN })
}

/**
 * Generate new user password
 * @param {id} userId - the id of user
 * @returns {Promise<string>} - new password
 */
const resetUserPassword = async (userId) => {
    return userRepo.resetUserPassword(userId)
}

/**
 * Update user by id
 * @param {Object} params
 * @param {id} userId
 * @param {Object} userBody
 * @returns
 */
const updateUserById = async ({ userId, userBody }) => {
    return userRepo.updateUserById({ userId, userBody })
}

/**
 *  Update user active status
 * @param {id} userId - the id of user
 * @returns {Promise<Boolean>}
 */
const updateUserActiveStatus = async (userId) => {
    return userRepo.updateUserActiveStatus(userId)
}

/**
 * Delete user by id
 * @param {id} userId - the id of user
 * @returns {Promise<Boolean>}
 */
const deleteUserById = async (userId) => {
    return userRepo.deleteUserById(userId)
}

/**
 * Get user by id
 * @param {id} userId - the id of user
 * @returns {Promise<User>} - the user info except password and emailVerificationCode
 */
const getUserById = async (userId) => {
    return userRepo.getUserProfileById(userId)
}

/**
 * Get all users by admin
 * @param {object} queries - the queries from request contains limit, page, orderBy, sortBy, email, roleId, email-keyword
 * @returns {Promise<Users>} - the list of users with pagination
 */
const getAllUsers = async ({ queries }) => {
    return userRepo.getAllUsers({ queries })
}

module.exports = {
    depositUserBalance,
    getAllRentServiceTransactions,
    getAllDepositTransactions,
    deleteProperty,
    updatePropertyStatus,
    getProperty,
    getAllProperties,
    resetUserPassword,
    updateUserById,
    updateUserActiveStatus,
    deleteUserById,
    getUserById,
    getAllUsers
}
