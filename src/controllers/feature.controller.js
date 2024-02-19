const { featureService } = require('../services')
const { OK } = require('../core/success.response')

const getAllFeatures = async (req, res) => {
    const listCategories = await featureService.getAllFeatures()
    new OK({
        message: 'Get list features success!',
        metaData: listCategories
    }).send(res)
}

module.exports = {
    getAllFeatures
}
