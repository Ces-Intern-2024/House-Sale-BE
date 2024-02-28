const bcrypt = require('bcrypt')
const { BadRequestError, AuthFailureError, NotFoundError, ForbiddenError } = require('../core/error.response')
const { userRepo, tokenRepo, locationRepo } = require('../models/repo')
const db = require('../models')
const { generateAuthTokens, verifyRefreshToken } = require('./token.service')
const { tokenTypes } = require('../config/tokens.config')
const { hashPassword, verifyGoogleToken } = require('../utils')
const { rolesId } = require('../config/roles.config')
const { ERROR_MESSAGES } = require('../core/message.constant')

/**
 * Update user information to send request to become a seller
 * @param {object} params
 * @param {id} params.userId - user id
 * @param {object} params.information - seller information to fulfill
 * @returns {Promise<User>}
 */
const fulFillSellerInformation = async ({ userId, information }) => {
    const user = await userRepo.getUserById(userId)
    if (!user) {
        throw new NotFoundError('User not found')
    }

    await locationRepo.checkLocation(information)

    const updatedUser = await db.Users.update({ ...information, roleId: rolesId.Seller }, { where: { userId } })
    if (!updatedUser[0]) {
        throw new BadRequestError('Error occurred when update your information!')
    }

    return userRepo.getUserById(userId)
}

/**
 * Login with google account and create new user if not exist
 * @param {Object} profile
 * @returns {Promise<User, Tokens>} - return user and tokens
 */
const loginWithGoogle = async (profile) => {
    const { fullName, email, accessToken } = profile
    await verifyGoogleToken(accessToken)
    const [user, created] = await db.Users.findOrCreate({
        where: { email },
        defaults: { fullName, roleId: rolesId.User, isActive: true, isEmailVerified: true }
    })
    if (!user) {
        throw new BadRequestError('Error occurred when login with your google account!')
    }

    const { userId } = user
    const tokens = await generateAuthTokens(userId)
    if (!tokens) {
        throw new BadRequestError('Error occurred when login with your google account!')
    }
    if (created) {
        await user.reload()
    }

    const { password: privateInfo, emailVerificationCode, ...userInfo } = user.get({ plain: true })
    return { userInfo, tokens }
}

/**
 * Verify user email with verification code
 * @param {Object} params
 * @param {id} userId - user id
 * @param {string} code - email verification code
 * @returns {Promise<boolean>}
 */
const verifyEmail = async ({ userId, code }) => {
    const user = await userRepo.getUserById(userId)
    if (!user || user?.roleId !== rolesId.Seller) {
        throw new NotFoundError('Seller not found')
    }

    if (user.isEmailVerified) {
        throw new BadRequestError('Your email already verified!')
    }

    const isMatchEmailVerificationCode = await bcrypt.compare(code, user.emailVerificationCode)
    if (!isMatchEmailVerificationCode) {
        throw new AuthFailureError('Incorrect email verification code!')
    }

    const updatedUser = await db.Users.update(
        { isEmailVerified: true, emailVerificationCode: null },
        { where: { userId } }
    )
    if (!updatedUser) {
        throw new BadRequestError('Verify email failed')
    }
}

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
        await locationRepo.checkLocation({ provinceCode, districtCode, wardCode })
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
    return userRepo.getUserProfileById(userId)
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
        throw new NotFoundError(ERROR_MESSAGES.REFRESH_TOKEN.TOKENS_NOT_FOUND)
    }

    const { tokenId, userId } = tokens
    const user = await userRepo.getUserById(userId)
    if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
    }

    const removedTokens = await tokenRepo.removeTokensByTokenId(tokenId)
    if (!removedTokens) {
        throw new BadRequestError(ERROR_MESSAGES.REFRESH_TOKEN.FAILED_TO_REMOVE_TOKENS)
    }

    const newTokens = await generateAuthTokens(userId)
    if (!newTokens) {
        throw new BadRequestError(ERROR_MESSAGES.REFRESH_TOKEN.FAILED_TO_CREATE_TOKENS)
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
        throw new NotFoundError(ERROR_MESSAGES.LOGOUT.INVALID_REFRESH_TOKEN)
    }

    const removedTokens = await tokenRepo.removeTokensByTokenId(tokens.tokenId)
    if (!removedTokens) {
        throw new BadRequestError(ERROR_MESSAGES.LOGOUT.FAILED_TO_LOGOUT)
    }
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
        throw new NotFoundError(ERROR_MESSAGES.LOGIN.EMAIL_NOT_FOUND)
    }

    const { userId, isActive, password: hashedPassword, emailVerificationCode, ...userInfo } = user

    if (!isActive) {
        throw new ForbiddenError(ERROR_MESSAGES.LOGIN.ACCOUNT_NOT_ACTIVE)
    }

    const isMatchPassword = await bcrypt.compare(password, hashedPassword)
    if (!isMatchPassword) {
        throw new AuthFailureError(ERROR_MESSAGES.LOGIN.INCORRECT_EMAIL_PASSWORD)
    }

    let tokens
    try {
        tokens = await generateAuthTokens(userId)
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.LOGIN.FAILED_CREATE_TOKENS)
    }

    return { user: { userId, isActive, ...userInfo }, tokens }
}

/**
 * Create new seller
 * @param {Object} userBody - seller information
 * @returns {Promise<User>} - return new seller
 */
const registerSeller = async (userBody) => {
    const { email, password } = userBody
    if (await userRepo.isEmailTaken(email)) {
        throw new ForbiddenError(ERROR_MESSAGES.REGISTER.EMAIL_ALREADY_TAKEN)
    }

    await locationRepo.checkLocation(userBody)

    const hashedPassword = await hashPassword(password)
    const newSeller = await db.Users.create({ ...userBody, password: hashedPassword, roleId: rolesId.Seller })
    if (!newSeller) {
        throw new BadRequestError(ERROR_MESSAGES.REGISTER_SELLER.FAILED_TO_CREATE_SELLER)
    }

    return newSeller.get({ plain: true })
}

/**
 * Create new user
 * @param {Object} userBody - user information
 * @returns {Promise<Boolean>}
 */
const registerUser = async (userBody) => {
    const { email, password } = userBody
    if (await userRepo.isEmailTaken(email)) {
        throw new ForbiddenError(ERROR_MESSAGES.REGISTER.EMAIL_ALREADY_TAKEN)
    }

    const hashedPassword = await hashPassword(password)
    const newUser = await db.Users.create({ email, password: hashedPassword, roleId: rolesId.User })
    if (!newUser) {
        throw new BadRequestError(ERROR_MESSAGES.REGISTER_USER.FAILED_TO_CREATE_USER)
    }
}

module.exports = {
    fulFillSellerInformation,
    loginWithGoogle,
    verifyEmail,
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
