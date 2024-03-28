const bcrypt = require('bcrypt')
const db = require('..')
const { BadRequestError, NotFoundError, AuthFailureError } = require('../../core/error.response')
const { generateVerifyEmailCode, paginatedData, hashPassword } = require('../../utils')
const { ERROR_MESSAGES } = require('../../core/message.constant')
const { PAGINATION_DEFAULT, COMMON_EXCLUDE_ATTRIBUTES } = require('../../core/data.constant')
const { checkLocation } = require('./location.repo')
const { rolesId } = require('../../config/roles.config')

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
 * Find user by userId
 * @param {id} userId - the id of user
 * @returns {Promise<User>} - the user object if found
 * @throws {NotFoundError} - if user not found
 */
const findUserById = async (userId) => {
    const user = await getUserById(userId)
    if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
    }
    return user
}

/**
 *  Update user active status
 * @param {id} userId  - the id of user
 * @returns {Promise<Boolean>}
 */
const updateUserActiveStatus = async (userId) => {
    validateUserId(userId)

    try {
        const user = await findUserById(userId)
        const updatedActiveStatus = !user.isActive

        const [updatedUser] = await db.Users.update({ isActive: updatedActiveStatus }, { where: { userId } })
        if (!updatedUser) throw new BadRequestError(ERROR_MESSAGES.USER.UPDATE_USER_ACTIVE_STATUS)

        return updatedActiveStatus
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof BadRequestError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.USER.UPDATE_USER_ACTIVE_STATUS)
    }
}

/**
 * Delete user by id
 * @param {Id} userId - the id of user
 * @returns {Promise<Boolean>}
 */

const deleteUserById = async (userId, transaction) => {
    const user = await db.Users.findByPk(userId)
    if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
    }
    await user.destroy({ transaction })
}

/**
 * Delete list of users by admin
 * @param {Array<Id>} userIds  - the list of user id
 * @returns {Promise<Boolean>}
 */
const deleteListUsers = async (userIds) => {
    const transaction = await db.sequelize.transaction()
    try {
        await Promise.all(userIds.map((userId) => deleteUserById(userId, transaction)))
        await transaction.commit()
    } catch (error) {
        await transaction.rollback()
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.USER.DELETE_LIST_USERS)
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
            where: { ...conditions, roleId: { [db.Sequelize.Op.not]: rolesId.Admin } },
            offset: (Number(page) - 1) * Number(limit),
            limit: Number(limit),
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
    const user = await findUserById(userId)

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
    await findUserById(userId)

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
    await findUserById(userId)

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
    const user = await findUserById(userId)
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
    const user = await findUserById(userId)
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

const resetUserPassword = async (userId) => {
    const user = await findUserById(userId)
    const newPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = await hashPassword(newPassword)
    try {
        await db.Users.update({ password: hashedPassword }, { where: { userId } })
        return { email: user.email, newPassword }
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.ADMIN.RESET_USER_PASSWORD_FAILED)
    }
}

/**
 * Get total accounts by role except admin
 * @returns {Promise<Array.<{roleId: number, roleName: string, total: number}>}
 */
const getTotalAccountsByRole = async () => {
    try {
        const totalAccountsByRole = await db.Users.findAll({
            where: { roleId: { [db.Sequelize.Op.not]: rolesId.Admin } },
            attributes: ['roleId', [db.Sequelize.fn('COUNT', 'roleId'), 'totalAccounts']],
            include: [
                {
                    model: db.Roles,
                    as: 'role',
                    attributes: ['roleName']
                }
            ],
            group: ['roleId'],
            raw: true
        })

        const result = totalAccountsByRole.map((role) => ({
            roleId: role.roleId,
            roleName: role['role.roleName'],
            totalAccounts: parseInt(role.totalAccounts, 10)
        }))

        return result
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.USER.GET_TOTAL_ACCOUNTS_BY_ROLE)
    }
}

module.exports = {
    getTotalAccountsByRole,
    findUserById,
    validateUserId,
    resetUserPassword,
    verifyEmail,
    changePassword,
    updateAvatar,
    updateUserById,
    updateUserActiveStatus,
    deleteUserById,
    deleteListUsers,
    getAllUsers,
    generateEmailVerificationCode,
    getUserProfileById,
    getUserById,
    getUserByEmail,
    isEmailTaken
}
