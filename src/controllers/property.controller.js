const { propertyService } = require('../services')
const { OK } = require('../core/success.response')

const getPropertiesByKeyword = async (req, res) => {
    const { keyword } = req.query
    const properties = await propertyService.getPropertiesByKeyword(keyword)
    new OK({
        message: 'Get list properties by keyword success!',
        metaData: properties
    }).send(res)
}

const getAllProperties = async (req, res) => {
    const options = req.query
    const properties = await propertyService.getAllProperties(options)
    new OK({
        message: 'Get list properties success!',
        metaData: properties
    }).send(res)
}

const getProperty = async (req, res) => {
    const { propertyId } = req.params
    const property = await propertyService.getProperty(propertyId)
    new OK({
        message: 'Get property success!',
        metaData: property
    }).send(res)
}

module.exports = {
    getAllProperties,
    getProperty,
    getPropertiesByKeyword
}
