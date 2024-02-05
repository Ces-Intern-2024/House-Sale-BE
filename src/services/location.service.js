const { BadRequestError } = require('../core/error.response')
const db = require('../models')
const { locationRepo } = require('../models/repo')

/**
 * Create new location for property
 * @param {Object} params - location parameters of property
 * @returns {Promise<Locations>}
 */
const createNewLocation = async ({ provinceCode, districtCode, wardCode, address, street }) => {
    const isValidLocation = await locationRepo.isValidLocation({ provinceCode, districtCode, wardCode })
    if (!isValidLocation) {
        throw new BadRequestError('Error occurred when checking location information!')
    }
    const newLocation = await db.Locations.create({
        provinceCode,
        districtCode,
        wardCode,
        address,
        street
    })
    if (!newLocation) {
        throw new BadRequestError('Creating new location failed!')
    }

    return newLocation
}

/**
 * Get all wards by district code
 * @param {string} districtCode
 * @returns {Promise<Wards>}
 */
const getAllWardsByDistrictCode = async (districtCode) => {
    const wardsList = await db.Wards.findAll({ where: { districtCode } })
    if (!wardsList || !wardsList.length) {
        throw new BadRequestError('Get all wards failed!')
    }

    return wardsList
}

/**
 * Get all districts by provinceCode
 * @param {string} provinceCode
 * @returns {Promise<Districts>}
 */
const getAllDistrictsByProvinceCode = async (provinceCode) => {
    const districtsList = await db.Districts.findAll({ where: { provinceCode } })
    if (!districtsList || !districtsList.length) {
        throw new BadRequestError('Get all provinces failed!')
    }

    return districtsList
}

/**
 * Get all provinces
 * @returns {Promise<Provinces>}
 */
const getAllProvinces = async () => {
    const provincesList = await db.Provinces.findAll()
    if (!provincesList || !provincesList.length) {
        throw new BadRequestError('Get all districts failed!')
    }

    return provincesList
}

module.exports = {
    createNewLocation,
    getAllWardsByDistrictCode,
    getAllDistrictsByProvinceCode,
    getAllProvinces
}
