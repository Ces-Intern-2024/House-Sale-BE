const { BadRequestError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')
const db = require('../models')
const { locationRepo } = require('../models/repo')

/**
 * Create new location for property
 * @param {Object} params - location parameters of property
 * @returns {Promise<Locations>}
 */
const createNewLocation = async ({ provinceCode, districtCode, wardCode, address, street }) => {
    await locationRepo.checkLocation({ provinceCode, districtCode, wardCode })
    const newLocation = await db.Locations.create({
        provinceCode,
        districtCode,
        wardCode,
        address,
        street
    })
    if (!newLocation) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.CREATE_NEW_LOCATION)
    }

    return newLocation
}

/**
 * Get all wards by district code
 * @param {string} districtCode
 * @returns {Promise<Wards>}
 */
const getAllWardsByDistrictCode = async (districtCode) => {
    return locationRepo.getAllWardsByDistrictCode(districtCode)
}

/**
 * Get all districts by provinceCode
 * @param {string} provinceCode
 * @returns {Promise<Districts>}
 */
const getAllDistrictsByProvinceCode = async (provinceCode) => {
    return locationRepo.getAllDistrictsByProvinceCode(provinceCode)
}

/**
 * Get all provinces
 * @returns {Promise<Provinces>}
 */
const getAllProvinces = async () => {
    return locationRepo.getAllProvinces()
}

module.exports = {
    createNewLocation,
    getAllWardsByDistrictCode,
    getAllDistrictsByProvinceCode,
    getAllProvinces
}
