const db = require('..')
const { BadRequestError } = require('../../core/error.response')

/**
 * Check if location information is valid
 * @param {Object} userBody
 * @returns {Promise<boolean>}
 */
const checkLocation = async ({ provinceCode, districtCode, wardCode }) => {
    const { provinceCode: validProvinceCode } = (await db.Provinces.findOne({ where: { provinceCode } })) || {}
    if (!validProvinceCode) {
        throw new BadRequestError('This province is not available yet. Please try again.')
    }

    const { districtCode: validDistrictCode } =
        (await db.Districts.findOne({ where: { districtCode, provinceCode: validProvinceCode } })) || {}
    if (!validDistrictCode) {
        throw new BadRequestError('This district is not available yet. Please try again.')
    }

    const { wardCode: validWardCode } =
        (await db.Wards.findOne({ where: { wardCode, districtCode: validDistrictCode } })) || {}
    if (!validWardCode) {
        throw new BadRequestError('This ward is not available yet. Please try again.')
    }
}

module.exports = {
    checkLocation
}
