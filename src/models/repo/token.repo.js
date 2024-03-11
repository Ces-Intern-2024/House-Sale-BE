const { Op } = require('sequelize')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const db = require('..')
const { jwtConfig } = require('../../config/jwt.config')
const { tokenTypes } = require('../../config/tokens.config')
const { BadRequestError, AuthFailureError, NotFoundError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')
const { findUserById } = require('./user.repo')

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
        throw new BadRequestError(ERROR_MESSAGES.TOKENS.FAILED_TO_REMOVE_TOKENS)
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
        throw new BadRequestError(ERROR_MESSAGES.TOKENS.FAILED_TO_GET_TOKENS)
    }
}

/**
 * Generate token
 * @param {id} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = jwtConfig.secret) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type
    }

    return jwt.sign(payload, secret)
}

/**
 * Verify refreshToken and return tokens (or throw an error if it is not valid)
 * @param {string} refreshToken
 * @param {string} type
 * @returns {Promise<Tokens>}
 */
const verifyRefreshToken = async ({ refreshToken, type }) => {
    const payload = jwt.verify(refreshToken, jwtConfig.secret)
    if (!payload || type !== payload.type) {
        throw new BadRequestError(ERROR_MESSAGES.TOKENS.FAILED_TO_VERIFY_REFRESH_TOKEN)
    }

    const tokens = await db.Tokens.findOne({
        where: {
            userId: payload.sub,
            refreshToken
        }
    })

    if (!tokens) {
        throw new NotFoundError(ERROR_MESSAGES.TOKENS.TOKENS_NOT_FOUND)
    }

    return tokens
}

/**
 * Save a token
 * @param {string} token
 * @param {id} userId
 * @param {Moment} expires
 * @param {string} type
 * @returns {Promise<Token>}
 */
const saveTokens = async (tokens) => {
    const savedTokens = await db.Tokens.create({
        ...tokens
    })
    if (!savedTokens) {
        throw new BadRequestError(ERROR_MESSAGES.TOKENS.FAILED_TO_CREATE_TOKENS)
    }

    return savedTokens
}

const generateAuthTokens = async (userId) => {
    const accessTokenExpires = moment().add(jwtConfig.accessExpirationMinutes, 'minutes')
    const accessToken = generateToken(userId, accessTokenExpires, tokenTypes.ACCESS)

    const refreshTokenExpires = moment().add(jwtConfig.refreshExpirationDays, 'days')
    const refreshToken = generateToken(userId, refreshTokenExpires, tokenTypes.REFRESH)

    const savedToken = await saveTokens({
        userId,
        accessToken,
        refreshToken,
        accessTokenExpires,
        refreshTokenExpires
    })
    if (!savedToken) {
        throw new BadRequestError(ERROR_MESSAGES.TOKENS.FAILED_TO_SAVE_TOKENS)
    }

    return { accessToken, refreshToken }
}

const refreshTokens = async (refreshToken) => {
    const tokens = await verifyRefreshToken({ refreshToken, type: tokenTypes.REFRESH })

    if (!tokens) {
        throw new NotFoundError(ERROR_MESSAGES.TOKENS.TOKENS_NOT_FOUND)
    }

    const { tokenId, userId } = tokens
    await findUserById(userId)

    const removedTokens = await removeTokensByTokenId(tokenId)
    if (!removedTokens) {
        throw new BadRequestError(ERROR_MESSAGES.TOKENS.FAILED_TO_REMOVE_TOKENS)
    }

    const newTokens = await generateAuthTokens(userId)
    if (!newTokens) {
        throw new BadRequestError(ERROR_MESSAGES.TOKENS.FAILED_TO_CREATE_TOKENS)
    }

    return newTokens
}

module.exports = {
    generateAuthTokens,
    refreshTokens,
    isValidAccessToken,
    removeTokensByTokenId,
    getTokensByRefreshToken
}
