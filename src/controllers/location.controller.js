const { locationService } = require('../services')
const { OK } = require('../core/success.response')

const getAllProvinces = async (req, res) => {
    const provincesList = await locationService.getAllProvinces()
    new OK({
        message: 'Get list provinces success!',
        metaData: provincesList
    }).send(res)
}

const getAllDistrictsByProvinceCode = async (req, res) => {
    const { provinceCode } = req.query
    const districtsList = await locationService.getAllDistrictsByProvinceCode(provinceCode)
    new OK({
        message: 'Get list districts success!',
        metaData: districtsList
    }).send(res)
}

const getAllWardsByDistrictCode = async (req, res) => {
    const { districtCode } = req.query
    const wardsList = await locationService.getAllWardsByDistrictCode(districtCode)
    new OK({
        message: 'Get list districts success!',
        metaData: wardsList
    }).send(res)
}

module.exports = {
    getAllProvinces,
    getAllDistrictsByProvinceCode,
    getAllWardsByDistrictCode
}
