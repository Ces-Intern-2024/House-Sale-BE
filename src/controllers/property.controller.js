const { propertyService } = require('../services')
const { OK } = require('../core/success.response')

const getAllProperties = async (req, res) => {
    const options = req.query
    const properties = await propertyService.getAllProperties(options)
    new OK({
        message: 'Get list properties success!',
        metaData: properties
    }).send(res)
}

module.exports = {
    getAllProperties
}
