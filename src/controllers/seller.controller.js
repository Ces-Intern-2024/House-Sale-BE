const { sellerService } = require('../services')
const { OK } = require('../core/success.response')

const getAllProperties = async (req, res) => {
    const sellerId = req.user?.userId
    const options = req.query
    const properties = await sellerService.getAllProperties({ options, sellerId })
    new OK({
        message: 'Get list properties success!',
        metaData: properties
    }).send(res)
}

module.exports = {
    getAllProperties
}
