const { propertyService } = require('../services')
const { OK } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

const getAllAvailablePropertyCountByFeatureAndCategory = async (req, res) => {
    const propertyCountList = await propertyService.getAllAvailablePropertyCountByFeatureAndCategory()
    new OK({
        message: SUCCESS_MESSAGES.PROPERTY.GET_ALL_AVAILABLE_COUNT,
        metaData: propertyCountList
    }).send(res)
}

const getAllProperties = async (req, res) => {
    const propertyOptions = req.query
    const properties = await propertyService.getAllProperties({ propertyOptions })
    new OK({
        message: SUCCESS_MESSAGES.PROPERTY.GET_ALL,
        metaData: properties
    }).send(res)
}

const getProperty = async (req, res) => {
    const { propertyId } = req.params
    const property = await propertyService.getProperty(propertyId)
    new OK({
        message: SUCCESS_MESSAGES.PROPERTY.GET,
        metaData: property
    }).send(res)
}

module.exports = {
    getAllAvailablePropertyCountByFeatureAndCategory,
    getAllProperties,
    getProperty
}
