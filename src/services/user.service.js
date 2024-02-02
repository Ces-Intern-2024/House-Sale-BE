const bcrypt = require('bcrypt')
const { BadRequestError, AuthFailureError, NotFoundError } = require('../core/error.response')
const { userRepo, tokenRepo } = require('../models/repo')
const db = require('../models')
const { generateAuthTokens, verifyRefreshToken } = require('./token.service')
const { tokenTypes } = require('../config/tokens.config')
const { hashPassword } = require('../utils')

/**
 * Update user's avatar
 * @param {Object} params
 * @param {id} userId
 * @param {string} imageUrl - image url for user's avatar
 * @returns {Promise<boolean>}
 */
const updateAvatar = async ({ userId, imageUrl }) => {
    const user = await userRepo.getUserById(userId)
    if (!user) {
        throw new NotFoundError('User not found')
    }

    const updatedAvatar = await db.Users.update({ avatar: imageUrl }, { where: { userId } })
    if (!updatedAvatar) {
        throw new BadRequestError('Update your avatar failed')
    }
}

/**
 * Get user profile and throw error if not found user
 * @param {id} userId
 * @returns {Promise<User>}
 */
const getProfile = async (userId) => {
    const user = await userRepo.getUserById(userId)
    if (!user) {
        throw new NotFoundError('User not found')
    }

    const userProfile = await userRepo.getUserProfile(userId)
    if (!userProfile) {
        throw new NotFoundError('User profile not found')
    }

    return userProfile
}

/**
 * Change the user's phone number and throw an error if it's the same as the old phone number.
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.newPhoneNumber - The new phone number to set.
 * @throws {BadRequestError} - Throws error if the user is not found, or if the new phone number is the same as the old one.
 */
const changePhoneNumber = async ({ userId, newPhoneNumber }) => {
    const user = await userRepo.getUserById(userId)
    if (!user) {
        throw new BadRequestError('Not found user')
    }

    if (newPhoneNumber === user.phone) {
        throw new BadRequestError(
            'New phone number cannot be same as your current phone number. Please choose a different phone number.'
        )
    }

    const updatedUser = await user.update({ phone: newPhoneNumber })
    if (!updatedUser) {
        throw new BadRequestError('Failed update phone number')
    }
}

/**
 * Change user password
 * @param {Object} userObject
 * @param {id} userObject.userId
 * @param {string} userObject.currentPassword
 * @param {string} userObject.newPassword
 * @throws {NotFoundError} if user not exist
 * @throws {AuthFailureError} if password not match
 * @throws {BadRequestError} if update password failed
 */
const changePassword = async ({ userId, currentPassword, newPassword }) => {
    const user = await userRepo.getUserById(userId)
    if (!user) {
        throw new NotFoundError('Not found user')
    }

    const isMatchPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isMatchPassword) {
        throw new AuthFailureError('Incorrect current password')
    }
    if (newPassword === currentPassword) {
        throw new BadRequestError(
            'New Password cannot be same as your current password. Please choose a different password.'
        )
    }

    const hashedPassword = await hashPassword(newPassword)
    const isUpdatedUser = await user.update({ password: hashedPassword })
    if (!isUpdatedUser) {
        throw new BadRequestError('Failed update password')
    }
}

/**
 * Remove refreshToken and generate new accessToken, new refreshToken
 * @param {string} refreshToken
 * @returns {Promise<Tokens>}
 */
const refreshTokens = async (refreshToken) => {
    const tokens = await verifyRefreshToken({ refreshToken, type: tokenTypes.REFRESH })
    if (!tokens) {
        throw new NotFoundError('Tokens not found')
    }

    const { tokenId, userId } = tokens
    const user = await userRepo.getUserById(userId)
    if (!user) {
        throw new NotFoundError('User not found')
    }

    const removedTokens = await tokenRepo.removeTokensByTokenId(tokenId)
    if (!removedTokens) {
        throw new BadRequestError('Error ocurred when logout!')
    }

    const newTokens = await generateAuthTokens(userId)
    if (!newTokens) {
        throw new BadRequestError('Failed creating new tokens')
    }

    return newTokens
}

/**
 * logout and remove refreshToken
 * @param {Object} userBody - userId & refreshToken
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

    const hashedPassword = await hashPassword(password)
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
    updateAvatar,
    getProfile,
    changePhoneNumber,
    refreshTokens,
    logout,
    login,
    register,
    changePassword
}
