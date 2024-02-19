const bcrypt = require('bcrypt')
const { BadRequestError, AuthFailureError, NotFoundError } = require('../core/error.response')
const { userRepo, tokenRepo } = require('../models/repo')
const db = require('../models')
const { generateAuthTokens, verifyRefreshToken } = require('./token.service')
const { tokenTypes } = require('../config/tokens.config')
const { hashPassword } = require('../utils')
const { rolesId } = require('../config/roles.config')

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
 * Update user's profile
 * @param {Object} params
 * @param {id} userId
 * @param {string} information - user's profile information
 * @returns {Promise<boolean>}
 */
const updateProfile = async ({ userId, information }) => {
    const { phone: newPhoneNumber, provinceCode, districtCode, wardCode } = information
    const user = await userRepo.getUserById(userId)
    if (!user) {
        throw new NotFoundError('User not found')
    }

    if (newPhoneNumber && newPhoneNumber === user.phone) {
        throw new BadRequestError(
            'New phone number cannot be same as your current phone number. Please choose a different phone number.'
        )
    }

    if (provinceCode && districtCode && wardCode) {
        const validLocation = await userRepo.isValidLocation({ provinceCode, districtCode, wardCode })
        if (!validLocation) {
            throw new BadRequestError(
                'Invalid location provided. Valid location contains valid provinceCode, districtCode, wardCode.'
            )
        }
    } else {
        const locationProvided = [provinceCode, districtCode, wardCode].filter(Boolean).length
        if (locationProvided > 0 && locationProvided < 3) {
            throw new BadRequestError(
                'Complete address information required. You must provide provinceCode, districtCode, and wardCode together.'
            )
        }
    }

    const [affectedRows] = await db.Users.update(information, { where: { userId } })
    if (affectedRows === 0) {
        throw new BadRequestError('Update your profile failed')
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
        throw new BadRequestError('Error ocurred when remove tokens!')
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
        roleId: user.roleId,
        email: user.email,
        fullName: user.fullName
    }

    return { user: userInfo, tokens }
}

/**
 * Create new seller
 * @param {Object} userBody - seller information
 * @returns {Promise<User, Tokens>} - return new seller and tokens
 */
const registerSeller = async (userBody) => {
    const { email, password } = userBody
    if (await userRepo.isEmailTaken(email)) {
        throw new BadRequestError('Seller already exists! Please register with another email.')
    }

    if (!(await userRepo.isValidLocation(userBody))) {
        throw new BadRequestError('Seller information not valid.')
    }

    const hashedPassword = await hashPassword(password)
    const newUser = await db.Users.create({ ...userBody, password: hashedPassword, roleId: rolesId.Seller })
    if (!newUser) {
        throw new BadRequestError('Failed creating new seller.')
    }

    const { userId } = newUser
    const tokens = await generateAuthTokens(userId)
    if (!tokens) {
        await db.Users.destroy({ where: { userId } })
        throw new BadRequestError('Failed creating tokens')
    }
    const { password: privateInfo, ...userInfo } = newUser.dataValues

    return { newSeller: userInfo, tokens }
}

/**
 * Create new user
 * @param {Object} userBody - user information
 * @returns {Promise<User, Tokens>} - return new user and tokens
 */
const registerUser = async (userBody) => {
    const { email, password } = userBody
    if (await userRepo.isEmailTaken(email)) {
        throw new BadRequestError('User already exists! Please register with another email.')
    }

    const hashedPassword = await hashPassword(password)
    const newUser = await db.Users.create({ email, password: hashedPassword, roleId: rolesId.User })
    if (!newUser) {
        throw new BadRequestError('Failed creating new user.')
    }

    const { userId } = newUser
    const tokens = await generateAuthTokens(userId)
    if (!tokens) {
        await db.Users.destroy({ where: { userId } })
        throw new BadRequestError('Failed creating tokens')
    }
    const { password: privateInfo, ...userInfo } = newUser.dataValues

    return { newSeller: userInfo, tokens }
}

module.exports = {
    updateAvatar,
    updateProfile,
    getProfile,
    refreshTokens,
    logout,
    login,
    registerSeller,
    registerUser,
    changePassword
}
