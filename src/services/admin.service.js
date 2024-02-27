const { userRepo } = require('../models/repo')

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
    getUserById,
    getAllUsers
}
