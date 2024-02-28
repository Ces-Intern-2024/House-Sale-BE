const { adminService } = require('../services')
const { OK } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

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
    updateUserActiveStatus,
    deleteUserById,
    getUserById,
    getAllUsers
}
