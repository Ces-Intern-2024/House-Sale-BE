const { adminService, emailService, propertyService } = require('../services')
const { OK } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

const deleteProperty = async (req, res) => {
    const { propertyId } = req.params
    await propertyService.deleteProperty({ propertyId })
    new OK({
        message: SUCCESS_MESSAGES.PROPERTY.DELETE
    }).send(res)
}

const updatePropertyStatus = async (req, res) => {
    const { propertyId } = req.params
    const updatedPropertyStatus = await propertyService.updatePropertyStatus(propertyId)
    new OK({
        message: updatedPropertyStatus
            ? SUCCESS_MESSAGES.ADMIN.UPDATE_STATUS.ACTIVE
            : SUCCESS_MESSAGES.ADMIN.UPDATE_STATUS.INACTIVE
    }).send(res)
}

const getProperty = async (req, res) => {
    const { propertyId } = req.params
    const property = await propertyService.getProperty(propertyId)
    new OK({
        message: SUCCESS_MESSAGES.PROPERTY.GET,
        metaData: property
    }).send(res)
}

const getAllProperties = async (req, res) => {
    const propertyOptions = req.query
    const properties = await propertyService.getAllProperties({ propertyOptions })
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

const deleteUserById = async (req, res) => {
    const { userId } = req.params
    await adminService.deleteUserById(userId)
    new OK({
        message: SUCCESS_MESSAGES.ADMIN.DELETE_USER
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
