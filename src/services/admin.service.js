const { ROLE_NAME, TRANSACTION } = require('../core/data.constant')
const {
    userRepo,
    propertyRepo,
    transactionRepo,
    categoryRepo,
    conversionRateRepo,
    serviceRepo
} = require('../models/repo')

/**
 * Count properties by feature
 * @returns {Promise<Object>} - List number of properties by feature
 */
const countPropertiesByFeature = async () => {
    return propertyRepo.countPropertiesByFeature()
}

/**
 * Delete service by list of serviceId
 * @param {Array<id>} serviceId - the list id of service to delete
 * @returns {Promise<boolean>}
 */
const deleteListServices = async (serviceIdList) => {
    const serviceIds = serviceIdList.split(',')
    return serviceRepo.deleteListServices(serviceIds)
}

/**
 * Update service by serviceId
 * @param {id} serviceId
 * @param {Object} updateBody
 * @returns {Promise<boolean>}
 */
const updateService = async (serviceId, updateBody) => {
    return serviceRepo.updateService(serviceId, updateBody)
}

/**
 * Create a new service
 * @param {Object} params
 * @param {string} params.serviceName - Name of the service
 * @param {number} params.price - Price of the service
 * @returns {Promise<boolean>}
 */
const createService = async (serviceBody) => {
    return serviceRepo.createService(serviceBody)
}

/**
 * Get all services
 * @returns {Promise<Service>}
 */
const getAllServices = async () => {
    return serviceRepo.getAllServices()
}

/**
 * Delete conversion rate by conversionRateId
 * @param {id} conversionRateId - conversion rate id
 * @returns {Promise<boolean>}
 */
const deleteConversionRate = async (conversionRateId) => {
    return conversionRateRepo.deleteConversionRate(conversionRateId)
}

/**
 * Update conversion rate
 * @param {id} conversionRateId - conversion rate id
 * @param {id} newExchangeRate - new exchange rate
 * @returns {Promise<boolean>}
 */
const updateConversionRate = async (conversionRateId, newExchangeRate) => {
    return conversionRateRepo.updateConversionRate(conversionRateId, newExchangeRate)
}

/**
 * Create new conversion rate
 * @param {Object} conversionRateBody
 * @returns {Promise<boolean>}
 */
const createConversionRate = async (conversionRateBody) => {
    return conversionRateRepo.createConversionRate(conversionRateBody)
}

/**
 * Get all services
 * @returns {Promise<ConversionRate[]>}
 */
const getAllConversionRates = async () => {
    return conversionRateRepo.getAllConversionRates()
}

/**
 * Delete category by categoryId
 * @param {id} categoryId
 * @returns {Promise<boolean>} - the result of delete category
 */
const deleteCategory = async (categoryId) => {
    return categoryRepo.deleteCategory(categoryId)
}

/**
 * Update category by categoryId
 * @param {Object} params
 * @param {id} params.categoryId - the id of category
 * @param {string} params.categoryName - the name of category
 * @returns {Promise<Category>} - the updated category
 */
const updateCategory = async ({ categoryId, categoryName }) => {
    return categoryRepo.updateCategory({ categoryId, categoryName })
}

/**
 * Create new category
 * @param {string} categoryName
 * @returns {Promise<boolean>} - the new category
 */
const createCategory = async (categoryName) => {
    return categoryRepo.createCategory(categoryName)
}

/**
 * Get all categories
 * @returns {Promise<Category[]>} - the list of categories
 */
const getAllCategories = async () => {
    return categoryRepo.getAllCategories()
}

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
 * @returns {Promise<RentServiceTransaction[]>} - the list of rent service transactions
 */
const getAllRentServiceTransactions = async (query) => {
    return transactionRepo.getAllRentServiceTransactions(query)
}

/**
 * Get all deposit transactions
 * @param {Object} query - the query from request contains userId, fromDateRange, toDateRange, page, limit, orderBy, sortBy
 * @returns {Promise<DepositTransaction[]>} - the list of deposit transactions
 */
const getAllDepositTransactions = async (query) => {
    return transactionRepo.getAllDepositTransactions(query)
}

/**
 * Permanently delete property by propertyId
 * @param {id} propertyId - id of property
 * @returns {Promise<boolean>}
 */
const deleteListProperties = async (propertyId) => {
    const propertyIds = propertyId.split(',')
    return propertyRepo.deleteListProperties({ propertyIds })
}

/**
 * Disabled property by propertyId
 * @param {id} propertyId - id of property
 * @returns {Promise<boolean>}
 */
const disableListProperties = async (propertyId) => {
    const propertyIds = propertyId.split(',')
    return propertyRepo.disableListProperties(propertyIds)
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
const deleteListUsers = async (userId) => {
    const userIds = userId.split(',')
    return userRepo.deleteListUsers(userIds)
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
    countPropertiesByFeature,
    deleteListServices,
    updateService,
    createService,
    getAllServices,
    deleteConversionRate,
    updateConversionRate,
    createConversionRate,
    getAllConversionRates,
    deleteCategory,
    updateCategory,
    createCategory,
    getAllCategories,
    depositUserBalance,
    getAllRentServiceTransactions,
    getAllDepositTransactions,
    deleteListProperties,
    disableListProperties,
    getProperty,
    getAllProperties,
    resetUserPassword,
    updateUserById,
    updateUserActiveStatus,
    deleteListUsers,
    getUserById,
    getAllUsers
}
