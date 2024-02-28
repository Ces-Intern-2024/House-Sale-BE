const bcrypt = require('bcrypt')
const db = require('..')
const { BadRequestError, NotFoundError, AuthFailureError } = require('../../core/error.response')
const { generateVerifyEmailCode, paginatedData, hashPassword } = require('../../utils')
const { ERROR_MESSAGES } = require('../../core/message.constant')
const { PAGINATION_DEFAULT, COMMON_EXCLUDE_ATTRIBUTES } = require('../../core/data.constant')
const { checkLocation } = require('./location.repo')

const validateUserId = (userId) => {
    if (!userId) {
        throw new BadRequestError(ERROR_MESSAGES.COMMON.REQUIRED_USER_ID)
    }
}

const validateEmail = (email) => {
    if (!email) {
        throw new BadRequestError(ERROR_MESSAGES.COMMON.REQUIRED_EMAIL)
    }
}

/**
 *  Update user active status
 * @param {id} userId  - the id of user
 * @returns {Promise<Boolean>}
 */
const updateUserActiveStatus = async (userId) => {
    validateUserId(userId)

    try {
        const user = await db.Users.findByPk(userId)
        if (!user) {
            throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
        }
        const updatedActiveStatus = !user.isActive
        await user.update({ isActive: updatedActiveStatus })

        return updatedActiveStatus
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.USER.UPDATE_USER_ACTIVE_STATUS)
    }
}

/**
 * Delete user by id
 * @param {id} userId - the id of user
 * @returns {Promise<Boolean>}
 */

const deleteUserById = async (userId) => {
    validateUserId(userId)

    try {
        const user = await db.Users.findByPk(userId)
        if (!user) {
            throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
        }
        await user.destroy()
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.USER.DELETE_USER)
    }
}

/**
 * Get all users by admin
 * @param {object} queries - the queries from request contains limit, page, orderBy, sortBy, email, roleId, email-keyword
 * @returns {Promise<Users>}
 */
const getAllUsers = async ({ queries }) => {
    try {
        const {
            roleId,
            email,
            limit = PAGINATION_DEFAULT.USER.LIMIT,
            page = PAGINATION_DEFAULT.USER.PAGE,
            orderBy = PAGINATION_DEFAULT.USER.ORDER_BY,
            sortBy = PAGINATION_DEFAULT.USER.SORT_BY
        } = queries
        const conditions = {
            ...(roleId && { roleId }),
            ...(email && { email: { [db.Sequelize.Op.like]: `%${email}%` } })
        }
        const listUsers = await db.Users.findAndCountAll({
            where: conditions,
            offset: (page - 1) * limit,
            limit,
            order: [[orderBy, sortBy]],
            attributes: { exclude: COMMON_EXCLUDE_ATTRIBUTES.USER }
        })

        return paginatedData({ data: listUsers, page, limit })
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.USER.GET_ALL_USERS)
    }
}

/**
 * Get user profile
 * @param {id} userId
 * @returns {Promise<User>}
 */
const getUserProfileById = async (userId) => {
    validateUserId(userId)

    try {
        const userProfile = await db.Users.findOne({
            where: { userId },
            attributes: { exclude: COMMON_EXCLUDE_ATTRIBUTES.USER }
        })
        if (!userProfile) {
            throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
        }

        return userProfile.get({ plain: true })
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.USER.GET_USER)
    }
}

/**
 * Get user by userId
 * @param {id} userId
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
    validateUserId(userId)

    try {
        const user = await db.Users.findByPk(userId)
        return user ? user.get({ plain: true }) : null
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.USER.GET_USER_BY_ID)
    }
}

/**
 * Get user by email
 * @param {*} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    validateEmail(email)

    try {
        const user = await db.Users.findOne({ where: { email } })
        return user ? user.get({ plain: true }) : null
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.USER.GET_USER_BY_EMAIL)
    }
}

/**
 * Check if email is already taken
 * @param {string} email
 * @returns {Promise<boolean>}
 */
const isEmailTaken = async (email) => {
    validateEmail(email)
    return !!(await getUserByEmail(email))
}

/**
 * generate email verification code and save hash code to database
 * @param {id} userId  - the id of user
 * @returns {Promise<string>} - the unique code
 */
const generateEmailVerificationCode = async (userId) => {
    validateUserId(userId)

    try {
        const { uniqueCode, hashVerificationCode } = await generateVerifyEmailCode(userId)
        await db.Users.update({ emailVerificationCode: hashVerificationCode }, { where: { userId } })

        return uniqueCode
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.USER.GENERATE_EMAIL_VERIFICATION_CODE)
    }
}

const validateUserBody = async ({ userId, userBody }) => {
    const user = await getUserById(userId)
    if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
    }

    if (!userBody || Object.keys(userBody).length === 0) {
        throw new BadRequestError(ERROR_MESSAGES.COMMON.NOTHING_TO_UPDATE)
    }

    const { phone: newPhoneNumber, provinceCode, districtCode, wardCode } = userBody
    if (newPhoneNumber && newPhoneNumber === user.phone) {
        throw new BadRequestError(ERROR_MESSAGES.USER.CAN_NOT_SAME_PHONE)
    }

    const locationProvided = [provinceCode, districtCode, wardCode].filter(Boolean).length
    if (locationProvided > 0 && locationProvided < 3) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.INVALID_LOCATION_PROVIDED)
    }
    if (locationProvided === 3) {
        await checkLocation({ provinceCode, districtCode, wardCode })
    }
}

const updateUserById = async ({ userId, userBody }) => {
    validateUserId(userId)
    const user = await getUserById(userId)
    if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
    }

    await validateUserBody({ userId, userBody })
    try {
        const [affectedRows] = await db.Users.update(userBody, { where: { userId } })
        if (affectedRows === 0) {
            throw new BadRequestError(ERROR_MESSAGES.USER.FAILED_TO_UPDATE_USER)
        }
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.USER.FAILED_TO_UPDATE_USER)
    }
}

const updateAvatar = async ({ userId, imageUrl }) => {
    validateUserId(userId)
    const user = await getUserById(userId)
    if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
    }

    try {
        const [affectedRows] = await db.Users.update({ avatar: imageUrl }, { where: { userId } })
        if (affectedRows === 0) {
            throw new BadRequestError(ERROR_MESSAGES.USER.UPDATE_AVATAR_FAILED)
        }
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.USER.UPDATE_AVATAR_FAILED)
    }
}

const changePassword = async ({ userId, currentPassword, newPassword }) => {
    validateUserId(userId)
    const user = await getUserById(userId)
    if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
    }

    const isMatchPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isMatchPassword) {
        throw new AuthFailureError(ERROR_MESSAGES.USER.INCORRECT_CURRENT_PASSWORD)
    }
    if (newPassword === currentPassword) {
        throw new BadRequestError(ERROR_MESSAGES.USER.CAN_NOT_SAME_PASSWORD)
    }

    const hashedPassword = await hashPassword(newPassword)
    try {
        const [affectedRows] = await db.Users.update({ password: hashedPassword }, { where: { userId } })
        if (affectedRows === 0) {
            throw new BadRequestError(ERROR_MESSAGES.USER.CHANGE_PASSWORD_FAILED)
        }
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.USER.CHANGE_PASSWORD_FAILED)
    }
}

/**
 * Verify user email with verification code
 * @param {Object} params
 * @param {id} userId - user id
 * @param {string} code - email verification code
 * @returns {Promise<boolean>}
 */
const verifyEmail = async ({ userId, code }) => {
    validateUserId(userId)
    const user = await getUserById(userId)
    if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
    }

    if (user.isEmailVerified) {
        throw new BadRequestError(ERROR_MESSAGES.USER.EMAIL_ALREADY_VERIFIED)
    }

    const isMatchEmailVerificationCode = await bcrypt.compare(code, user.emailVerificationCode)
    if (!isMatchEmailVerificationCode) {
        throw new AuthFailureError(ERROR_MESSAGES.USER.INVALID_EMAIL_VERIFICATION_CODE)
    }

    const updatedUser = await db.Users.update(
        { isEmailVerified: true, emailVerificationCode: null },
        { where: { userId } }
    )
    if (!updatedUser) {
        throw new BadRequestError(ERROR_MESSAGES.USER.FAILED_TO_VERIFY_EMAIL)
    }
}

module.exports = {
    verifyEmail,
    changePassword,
    updateAvatar,
    updateUserById,
    updateUserActiveStatus,
    deleteUserById,
    getAllUsers,
    generateEmailVerificationCode,
    getUserProfileById,
    getUserById,
    getUserByEmail,
    isEmailTaken
}
