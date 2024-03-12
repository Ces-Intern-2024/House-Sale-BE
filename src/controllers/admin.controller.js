const { adminService, emailService } = require('../services')
const { OK } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

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
