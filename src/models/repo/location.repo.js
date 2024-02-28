const db = require('..')
const { BadRequestError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')

const checkProvinceCode = async (provinceCode) => {
    const { provinceCode: validProvinceCode } = (await db.Provinces.findOne({ where: { provinceCode } })) || {}
    if (!validProvinceCode) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.INVALID_PROVINCE)
    }
    return validProvinceCode
}

const checkDistrictCode = async (districtCode, provinceCode) => {
    const { districtCode: validDistrictCode } =
        (await db.Districts.findOne({ where: { districtCode, provinceCode } })) || {}
    if (!validDistrictCode) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.INVALID_DISTRICT)
    }
    return validDistrictCode
}

const checkWardCode = async (wardCode, districtCode) => {
    const { wardCode: validWardCode } = (await db.Wards.findOne({ where: { wardCode, districtCode } })) || {}
    if (!validWardCode) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.INVALID_WARD)
    }
    return validWardCode
}

/**
 * Check if location information is valid
 * @param {Object} userBody
 * @returns {Promise<boolean>}
 */
const checkLocation = async ({ provinceCode, districtCode, wardCode }) => {
    const validProvinceCode = await checkProvinceCode(provinceCode)
    const validDistrictCode = await checkDistrictCode(districtCode, validProvinceCode)
    await checkWardCode(wardCode, validDistrictCode)
}

module.exports = {
    checkProvinceCode,
    checkDistrictCode,
    checkWardCode,
    checkLocation
}
