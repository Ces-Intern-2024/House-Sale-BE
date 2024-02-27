const jwt = require('jsonwebtoken')
const moment = require('moment')
const { jwtConfig } = require('../config/jwt.config')
const { tokenTypes } = require('../config/tokens.config')
const db = require('../models')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')

/**
 * Verify refreshToken and return tokens (or throw an error if it is not valid)
 * @param {string} refreshToken
 * @param {string} type
 * @returns {Promise<Tokens>}
 */
const verifyRefreshToken = async ({ refreshToken, type }) => {
    const payload = jwt.verify(refreshToken, jwtConfig.secret)
    if (!payload || type !== payload.type) {
        throw new BadRequestError(ERROR_MESSAGES.REFRESH_TOKEN.FAILED_TO_VERIFY_REFRESH_TOKEN)
    }

    const tokens = await db.Tokens.findOne({
        where: {
            userId: payload.sub,
            refreshToken
        }
    })
    if (!tokens) {
        throw new NotFoundError(ERROR_MESSAGES.REFRESH_TOKEN.TOKENS_NOT_FOUND)
    }

    return tokens
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
        throw new BadRequestError(ERROR_MESSAGES.REFRESH_TOKEN.FAILED_TO_CREATE_TOKENS)
    }

    return savedTokens
}

/**
 * Generate auth tokens
 * @param {id} userId
 * @returns {Promise<Object>}
 */
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
        throw new BadRequestError(ERROR_MESSAGES.REFRESH_TOKEN.FAILED_TO_SAVE_TOKENS)
    }

    return { accessToken, refreshToken }
}

module.exports = {
    verifyRefreshToken,
    generateAuthTokens
}
