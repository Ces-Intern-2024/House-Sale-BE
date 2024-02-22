const { propertyService } = require('../services')
const { OK } = require('../core/success.response')

const getAllProperties = async (req, res) => {
    const propertyOptions = req.query
    const properties = await propertyService.getAllProperties({ propertyOptions })
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
    getProperty
}
