const { adminService, emailService } = require('../services')
const { OK, Created } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

const countContactsByDate = async (req, res) => {
    const countList = await adminService.countContactsByDate(req.query)
    new OK({
        message: SUCCESS_MESSAGES.ADMIN.REPORT.COUNT_CONTACTS_BY_DATE,
        metaData: countList
    }).send(res)
}

const countPropertiesCreatedByDate = async (req, res) => {
    const countList = await adminService.countPropertiesCreatedByDate(req.query)
    new OK({
        message: SUCCESS_MESSAGES.ADMIN.REPORT.COUNT_PROPERTIES_CREATED_BY_DATE,
        metaData: countList
    }).send(res)
}

const countPropertiesByCategory = async (req, res) => {
    const countList = await adminService.countPropertiesByCategory()
    new OK({
        message: SUCCESS_MESSAGES.ADMIN.REPORT.COUNT_PROPERTIES_BY_CATEGORY,
        metaData: countList
    }).send(res)
}

const countPropertiesByFeature = async (req, res) => {
    const countList = await adminService.countPropertiesByFeature()
    new OK({
        message: SUCCESS_MESSAGES.ADMIN.REPORT.COUNT_PROPERTIES_BY_FEATURE,
        metaData: countList
    }).send(res)
}

const deleteService = async (req, res) => {
    const { serviceId: serviceIdList } = req.query
    await adminService.deleteListServices(serviceIdList)
    new OK({
        message: SUCCESS_MESSAGES.SERVICE.DELETE_LIST_SERVICE
    }).send(res)
}

const updateService = async (req, res) => {
    const { serviceId } = req.params
    const updateBody = req.body
    await adminService.updateService(serviceId, updateBody)
    new OK({
        message: SUCCESS_MESSAGES.SERVICE.UPDATE_SERVICE
    }).send(res)
}

const createService = async (req, res) => {
    await adminService.createService(req.body)
    new Created({
        message: SUCCESS_MESSAGES.SERVICE.CREATE_SERVICE
    }).send(res)
}

const getAllServices = async (req, res) => {
    const listServices = await adminService.getAllServices()
    new OK({
        message: SUCCESS_MESSAGES.SERVICE.GET_ALL_SERVICES,
        metaData: listServices
    }).send(res)
}

const deleteConversionRate = async (req, res) => {
    const { conversionRateId } = req.params
    await adminService.deleteConversionRate(conversionRateId)
    new OK({
        message: SUCCESS_MESSAGES.CONVERSION_RATE.DELETE_CONVERSION_RATE
    }).send(res)
}

const updateConversionRate = async (req, res) => {
    const { conversionRateId } = req.params
    const { newExchangeRate } = req.body
    await adminService.updateConversionRate(conversionRateId, newExchangeRate)
    new OK({
        message: SUCCESS_MESSAGES.CONVERSION_RATE.UPDATE_CONVERSION_RATE
    }).send(res)
}

const createConversionRate = async (req, res) => {
    await adminService.createConversionRate(req.body)
    new Created({
        message: SUCCESS_MESSAGES.CONVERSION_RATE.CREATE_CONVERSION_RATE
    }).send(res)
}

const getAllConversionRates = async (req, res) => {
    const listConversionRates = await adminService.getAllConversionRates()
    new OK({
        message: SUCCESS_MESSAGES.CONVERSION_RATE.GET_ALL_CONVERSION_RATES,
        metaData: listConversionRates
    }).send(res)
}
const deleteCategory = async (req, res) => {
    const { categoryId } = req.params
    await adminService.deleteCategory(categoryId)
    new OK({
        message: SUCCESS_MESSAGES.CATEGORY.DELETE
    }).send(res)
}

const updateCategory = async (req, res) => {
    const { categoryId } = req.params
    const { categoryName } = req.body
    await adminService.updateCategory({ categoryId, categoryName })
    new OK({
        message: SUCCESS_MESSAGES.CATEGORY.UPDATE
    }).send(res)
}

const createCategory = async (req, res) => {
    const { categoryName } = req.body
    const newCategory = await adminService.createCategory(categoryName)
    new OK({
        message: SUCCESS_MESSAGES.CATEGORY.CREATE,
        metaData: newCategory
    }).send(res)
}

const getAllCategories = async (req, res) => {
    const categories = await adminService.getAllCategories()
    new OK({
        message: SUCCESS_MESSAGES.CATEGORY.GET_CATEGORIES,
        metaData: categories
    }).send(res)
}

const depositUserBalance = async (req, res) => {
    const { userId } = req.params
    const { amount } = req.body
    const { newDeposit, currentBalance } = await adminService.depositUserBalance({ userId, amount })
    new OK({
        message: SUCCESS_MESSAGES.TRANSACTION.DEPOSIT_TO_USER_BALANCE_BY_ADMIN({ userId, newDeposit, currentBalance })
    }).send(res)
}

const getAllRentServiceTransactions = async (req, res) => {
    const transactions = await adminService.getAllRentServiceTransactions(req.query)
    new OK({
        message: SUCCESS_MESSAGES.TRANSACTION.GET_ALL_RENT_SERVICE_TRANSACTIONS,
        metaData: transactions
    }).send(res)
}

const getAllDepositTransactions = async (req, res) => {
    const transactions = await adminService.getAllDepositTransactions(req.query)
    new OK({
        message: SUCCESS_MESSAGES.TRANSACTION.GET_ALL_DEPOSIT_TRANSACTIONS,
        metaData: transactions
    }).send(res)
}

const deleteListProperties = async (req, res) => {
    const { propertyId } = req.query
    await adminService.deleteListProperties(propertyId)
    new OK({
        message: SUCCESS_MESSAGES.PROPERTY.DELETE_LIST_PROPERTIES
    }).send(res)
}

const disableListProperties = async (req, res) => {
    const { propertyId } = req.query
    await adminService.disableListProperties(propertyId)
    new OK({
        message: SUCCESS_MESSAGES.ADMIN.DISABLED_LIST_PROPERTIES
    }).send(res)
}

const getProperty = async (req, res) => {
    const { propertyId } = req.params
    const property = await adminService.getProperty(propertyId)
    new OK({
        message: SUCCESS_MESSAGES.PROPERTY.GET,
        metaData: property
    }).send(res)
}

const getAllProperties = async (req, res) => {
    const propertyOptions = req.query
    const properties = await adminService.getAllProperties({ propertyOptions })
    new OK({
        message: SUCCESS_MESSAGES.PROPERTY.GET_ALL,
        metaData: properties
    }).send(res)
}

const resetUserPassword = async (req, res) => {
    const { userId } = req.params
    const { email, newPassword } = await adminService.resetUserPassword(userId)
    await emailService.sendResetPasswordEmail({ email, newPassword })
    new OK({
        message: SUCCESS_MESSAGES.ADMIN.RESET_USER_PASSWORD
    }).send(res)
}

const updateUserById = async (req, res) => {
    const { userId } = req.params
    const userBody = req.body
    await adminService.updateUserById({ userId, userBody })
    new OK({
        message: SUCCESS_MESSAGES.ADMIN.UPDATE_USER
    }).send(res)
}

const updateUserActiveStatus = async (req, res) => {
    const { userId } = req.params
    const updatedActiveStatus = await adminService.updateUserActiveStatus(userId)
    new OK({
        message: updatedActiveStatus
            ? SUCCESS_MESSAGES.ADMIN.UPDATE_USER_ACTIVE_STATUS.ACTIVE
            : SUCCESS_MESSAGES.ADMIN.UPDATE_USER_ACTIVE_STATUS.INACTIVE
    }).send(res)
}

const deleteListUsers = async (req, res) => {
    const { userId } = req.query
    await adminService.deleteListUsers(userId)
    new OK({
        message: SUCCESS_MESSAGES.ADMIN.DELETE_LIST_PROPERTIES
    }).send(res)
}

const getUserById = async (req, res) => {
    const { userId } = req.params
    const user = await adminService.getUserById(userId)
    new OK({
        message: SUCCESS_MESSAGES.ADMIN.GET_USER,
        metaData: user
    }).send(res)
}

const getAllUsers = async (req, res) => {
    const listUsers = await adminService.getAllUsers({ queries: req.query })
    new OK({
        message: SUCCESS_MESSAGES.ADMIN.GET_ALL_USERS,
        metaData: listUsers
    }).send(res)
}

module.exports = {
    countContactsByDate,
    countPropertiesCreatedByDate,
    countPropertiesByCategory,
    countPropertiesByFeature,
    deleteService,
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
