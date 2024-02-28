const { locationService } = require('../services')
const { OK } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

const getAllProvinces = async (req, res) => {
    const provincesList = await locationService.getAllProvinces()
    new OK({
        message: SUCCESS_MESSAGES.LOCATION.GET_PROVINCES,
        metaData: provincesList
    }).send(res)
}

const getAllDistrictsByProvinceCode = async (req, res) => {
    const { provinceCode } = req.query
    const districtsList = await locationService.getAllDistrictsByProvinceCode(provinceCode)
    new OK({
        message: SUCCESS_MESSAGES.LOCATION.GET_DISTRICTS,
        metaData: districtsList
    }).send(res)
}

const getAllWardsByDistrictCode = async (req, res) => {
    const { districtCode } = req.query
    const wardsList = await locationService.getAllWardsByDistrictCode(districtCode)
    new OK({
        message: SUCCESS_MESSAGES.LOCATION.GET_WARDS,
        metaData: wardsList
    }).send(res)
}

module.exports = {
    getAllProvinces,
    getAllDistrictsByProvinceCode,
    getAllWardsByDistrictCode
}
