const { Op } = require('sequelize')
const db = require('..')
const { BadRequestError, AuthFailureError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')

/**
 * check if accessToken exists in database and not expired
 * @param {string} accessToken
 * @param {id} userId
 * @returns {Promise<boolean>}
 */
const isValidAccessToken = async (accessToken, userId) => {
    try {
        const validAccessToken = await db.Tokens.findOne({
            where: {
                userId,
                accessToken,
                accessTokenExpires: {
                    [Op.gt]: new Date()
                }
            }
        })
        if (!validAccessToken) {
            throw new AuthFailureError(ERROR_MESSAGES.ACCESS_TOKEN.INVALID_ACCESS_TOKEN)
        }

        return !!validAccessToken
    } catch (error) {
        throw new AuthFailureError(ERROR_MESSAGES.ACCESS_TOKEN.INVALID_ACCESS_TOKEN)
    }
}

/**
 * Remove refreshToken
 * @param {id} tokenId
 * @returns {Promise<boolean>}
 */
const removeTokensByTokenId = async (tokenId) => {
    try {
        return db.Tokens.destroy({ where: { tokenId } })
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.REFRESH_TOKEN.FAILED_TO_REMOVE_TOKENS)
    }
}

/**
 *  Get tokens by refreshToken
 * @param {string} refreshToken
 * @returns {Promise<Tokens>}
 */
const getTokensByRefreshToken = async (refreshToken) => {
    try {
        return db.Tokens.findOne({
            where: { refreshToken }
        })
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.REFRESH_TOKEN.FAILED_TO_GET_TOKENS)
    }
}

module.exports = {
    isValidAccessToken,
    removeTokensByTokenId,
    getTokensByRefreshToken
}
