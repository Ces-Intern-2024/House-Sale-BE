const { tokenRepo } = require('../models/repo')

/**
 * Generate auth tokens
 * @param {id} userId
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (userId) => {
    return tokenRepo.generateAuthTokens(userId)
}

module.exports = {
    generateAuthTokens
}
