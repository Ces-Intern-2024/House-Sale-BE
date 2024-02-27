const db = require('..')
const { BadRequestError, NotFoundError } = require('../../core/error.response')
const { generateVerifyEmailCode, paginatedData } = require('../../utils')
const { ERROR_MESSAGES } = require('../../core/message.constant')
const { PAGINATION_DEFAULT, COMMON_EXCLUDE_ATTRIBUTES } = require('../../core/data.constant')

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
        throw new BadRequestError(ERROR_MESSAGES.ADMIN.GET_ALL_USERS)
    }
}

/**
 * Get user profile
 * @param {id} userId
 * @returns {Promise<User>}
 */
const getUserProfileById = async (userId) => {
    if (!userId) {
        throw new BadRequestError(ERROR_MESSAGES.COMMON.REQUIRED_USER_ID)
    }

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
    if (!userId) {
        throw new BadRequestError(ERROR_MESSAGES.COMMON.REQUIRED_USER_ID)
    }

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
    if (!email) {
        throw new BadRequestError(ERROR_MESSAGES.COMMON.REQUIRED_EMAIL)
    }

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
    if (!email) {
        throw new BadRequestError(ERROR_MESSAGES.COMMON.REQUIRED_EMAIL)
    }
    return !!(await getUserByEmail(email))
}

/**
 * generate email verification code and save hash code to database
 * @param {id} userId  - the id of user
 * @returns {Promise<string>} - the unique code
 */
const generateEmailVerificationCode = async (userId) => {
    if (!userId) {
        throw new BadRequestError(ERROR_MESSAGES.COMMON.REQUIRED_USER_ID)
    }

    try {
        const { uniqueCode, hashVerificationCode } = await generateVerifyEmailCode(userId)
        await db.Users.update({ emailVerificationCode: hashVerificationCode }, { where: { userId } })

        return uniqueCode
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.USER.GENERATE_EMAIL_VERIFICATION_CODE)
    }
}

module.exports = {
    getAllUsers,
    generateEmailVerificationCode,
    getUserProfileById,
    getUserById,
    getUserByEmail,
    isEmailTaken
}
