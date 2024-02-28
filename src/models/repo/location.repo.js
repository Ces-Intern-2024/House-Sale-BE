const db = require('..')
const { BadRequestError, NotFoundError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')

const checkProvinceCode = async (provinceCode) => {
    const { provinceCode: validProvinceCode } = (await db.Provinces.findOne({ where: { provinceCode } })) || {}
    if (!validProvinceCode) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.INVALID_PROVINCE)
    }
    return validProvinceCode
}

const checkDistrictCode = async (districtCode, provinceCode) => {
    const where = provinceCode ? { districtCode, provinceCode } : { districtCode }

    const { districtCode: validDistrictCode } = (await db.Districts.findOne({ where })) || {}

    if (!validDistrictCode) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.INVALID_DISTRICT)
    }

    return validDistrictCode
}

const checkWardCode = async (wardCode, districtCode) => {
    const where = districtCode ? { wardCode, districtCode } : { wardCode }
    const { wardCode: validWardCode } = (await db.Wards.findOne({ where })) || {}
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

const getAllProvinces = async () => {
    try {
        const provincesList = await db.Provinces.findAll()
        if (!provincesList) {
            throw new BadRequestError(ERROR_MESSAGES.LOCATION.GET_PROVINCES)
        }

        if (provincesList.length === 0) {
            throw new BadRequestError(ERROR_MESSAGES.LOCATION.PROVINCES_NOT_FOUND)
        }

        return provincesList
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.GET_PROVINCES)
    }
}

const getAllDistrictsByProvinceCode = async (provinceCode) => {
    if (!provinceCode) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.REQUIRE_PROVINCE)
    }

    await checkProvinceCode(provinceCode)

    try {
        const districtsList = await db.Districts.findAll({ where: { provinceCode } })
        if (!districtsList) {
            throw new BadRequestError(ERROR_MESSAGES.LOCATION.GET_DISTRICTS)
        }

        if (districtsList.length === 0) {
            throw new NotFoundError(ERROR_MESSAGES.LOCATION.DISTRICTS_NOT_FOUND)
        }
        return districtsList
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.GET_DISTRICTS)
    }
}

const getAllWardsByDistrictCode = async (districtCode) => {
    if (!districtCode) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.REQUIRE_DISTRICT)
    }
    await checkDistrictCode(districtCode)

    try {
        const wardsList = await db.Wards.findAll({ where: { districtCode } })
        if (!wardsList) {
            throw new BadRequestError(ERROR_MESSAGES.LOCATION.GET_WARDS)
        }

        if (wardsList.length === 0) {
            throw new NotFoundError(ERROR_MESSAGES.LOCATION.WARDS_NOT_FOUND)
        }
        return wardsList
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.GET_WARDS)
    }
}

module.exports = {
    getAllWardsByDistrictCode,
    getAllDistrictsByProvinceCode,
    getAllProvinces,
    checkProvinceCode,
    checkDistrictCode,
    checkWardCode,
    checkLocation
}
