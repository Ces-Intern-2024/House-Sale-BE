const bcrypt = require('bcrypt')
const { BadRequestError, AuthFailureError, NotFoundError } = require('../core/error.response')
const { userRepo, tokenRepo } = require('../models/repo')
const db = require('../models')
const { generateAuthTokens } = require('./token.service')

/**
 * logout and remove refreshToken
 * @param {Object} userBody - refreshToken
 * @returns {Promise<boolean>}
 */
const logout = async ({ userId, refreshToken }) => {
    const tokens = await tokenRepo.getTokensByRefreshToken(refreshToken)
    if (!tokens || tokens.userId !== userId) {
        throw new NotFoundError('RefreshToken not valid.')
    }

    const removedTokens = await tokenRepo.removeTokensByTokenId(tokens.tokenId)
    if (!removedTokens) {
        throw new BadRequestError('Error ocurred when logout!')
    }

    return removedTokens
}

/**
 * login with email and password
 * @param {Object} userBody -user email and password
 * @returns {Promise<User, Tokens>} - return user and new tokens
 */
const login = async (userBody) => {
    const { email, password } = userBody
    const user = await userRepo.getUserByEmail(email)
    if (!user) {
        throw new BadRequestError('Email not registered!')
    }

    const isMatchPassword = await bcrypt.compare(password, user.password)
    if (!isMatchPassword) {
        throw new AuthFailureError('Incorrect email or password')
    }

    const { userId } = user
    const tokens = await generateAuthTokens(userId)
    if (!tokens) {
        throw new BadRequestError('Failed creating tokens')
    }

    const userInfo = {
        userId: user.userId,
        email: user.email,
        fullName: user.fullName
    }

    return { user: userInfo, tokens }
}

/**
 * Create new user
 * @param {Object} userBody - user information
 * @returns {Promise<User, Tokens>} - return new user and tokens
 */
const register = async (userBody) => {
    const { email, password } = userBody
    if (await userRepo.isEmailTaken(email)) {
        throw new BadRequestError('User already exists! Please register with another email.')
    }

    if (!(await userRepo.isValidUserInformation(userBody))) {
        throw new BadRequestError('User information not valid.')
    }

    const roundsSalt = 10
    const hashedPassword = await bcrypt.hash(password, roundsSalt)
    const newUser = await db.Users.create({ ...userBody, password: hashedPassword })
    if (!newUser) {
        throw new BadRequestError('Failed creating new user.')
    }

    const { userId } = newUser
    const tokens = await generateAuthTokens(userId)
    if (!tokens) {
        await db.Users.destroy({ where: { userId } })
        throw new BadRequestError('Failed creating tokens')
    }

    const userInfo = {
        userId: newUser.userId,
        email: newUser.email,
        fullName: newUser.fullName
    }

    return { newUser: userInfo, tokens }
}

module.exports = {
    logout,
    login,
    register
}
