const { featureService } = require('../services')
const { OK } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

const getAllFeatures = async (req, res) => {
    const listFeatures = await featureService.getAllFeatures()
    new OK({
        message: SUCCESS_MESSAGES.FEATURE.GET_FEATURES,
        metaData: listFeatures
    }).send(res)
}

module.exports = {
    getAllFeatures
}
