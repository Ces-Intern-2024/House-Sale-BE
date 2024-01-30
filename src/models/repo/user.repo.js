const db = require('..')
const { BadRequestError } = require('../../core/error.response')
const { isValidKeyOfModel } = require('../../utils')

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
        const { roleId, provinceCode, districtCode, wardCode } = userBody
        const validKeys = await Promise.all([
            isValidKeyOfModel(db.Roles, roleId, 'This role is not available yet, Please try again'),
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
    isEmailTaken,
    isValidUserInformation
}
