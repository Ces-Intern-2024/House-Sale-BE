const db = require('..')
const { BadRequestError, NotFoundError } = require('../../core/error.response')
const { isValidKeyOfModel } = require('../../utils')

const commonUserProfileScope = [
    {
        model: db.Roles,
        as: 'role',
        attributes: ['roleId', 'roleName']
    },
    {
        model: db.Wards,
        as: 'ward',
        attributes: ['wardCode', 'fullNameEn']
    },
    {
        model: db.Provinces,
        as: 'province',
        attributes: ['provinceCode', 'fullNameEn']
    },
    {
        model: db.Districts,
        as: 'district',
        attributes: ['districtCode', 'fullNameEn']
    }
]

const commonExcludeAttributes = ['roleId', 'password', 'wardCode', 'districtCode', 'provinceCode']

/**
 * Get user profile
 * @param {id} userId
 * @returns {Promise<User>}
 */
const getUserProfile = async (userId) => {
    try {
        const userProfile = await db.Users.findOne({
            where: {
                userId
            },
            include: commonUserProfileScope,
            attributes: { exclude: commonExcludeAttributes }
        })
        if (!userProfile) {
            throw new NotFoundError('User profile not found')
        }

        return userProfile
    } catch (error) {
        throw new BadRequestError('Error ocurred when get user profile')
    }
}

/**
 * Get user by userId
 * @param {id} userId
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
    try {
        return db.Users.findByPk(userId)
    } catch (error) {
        throw new BadRequestError('An error occurred while checking user exist.')
    }
}

/**
 * Get user by email
 * @param {*} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    try {
        return db.Users.findOne({
            where: {
                email
            }
        })
    } catch (error) {
        throw new BadRequestError('An error occurred while checking user exist.')
    }
}

/**
 * Check if email is already taken
 * @param {string} email
 * @returns {Promise<boolean>}
 */
const isEmailTaken = async (email) => {
    try {
        const user = await db.Users.findOne({
            where: {
                email
            }
        })
        return !!user
    } catch (error) {
        throw new BadRequestError('An error occurred while checking email exist.')
    }
}

/**
 * Check if user input information is valid
 * @param {Object} userBody
 * @returns {Promise<boolean>}
 */
const isValidUserInformation = async (userBody) => {
    try {
        const { provinceCode, districtCode, wardCode } = userBody
        const validKeys = await Promise.all([
            isValidKeyOfModel(db.Provinces, provinceCode, 'This province is not available yet. Please try again.'),
            isValidKeyOfModel(db.Districts, districtCode, 'This district is not available yet. Please try again.'),
            isValidKeyOfModel(db.Wards, wardCode, 'This ward is not available yet. Please try again.')
        ])

        return validKeys.every((key) => !!key)
    } catch (error) {
        throw new BadRequestError(error.message)
    }
}

module.exports = {
    getUserProfile,
    getUserById,
    getUserByEmail,
    isEmailTaken,
    isValidUserInformation
}
