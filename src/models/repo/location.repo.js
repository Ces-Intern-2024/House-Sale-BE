const db = require('..')
const { BadRequestError } = require('../../core/error.response')
const { isValidKeyOfModel } = require('../../utils')

/**
 * Check if location information is valid
 * @param {Object} userBody
 * @returns {Promise<boolean>}
 */
const isValidLocation = async ({ provinceCode, districtCode, wardCode }) => {
    try {
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
    isValidLocation
}
