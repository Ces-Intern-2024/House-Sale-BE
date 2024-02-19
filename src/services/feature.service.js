const { BadRequestError } = require('../core/error.response')
const { featureRepo } = require('../models/repo')

const getAllFeatures = async () => {
    const listFeatures = await featureRepo.getAllFeatures()
    if (!listFeatures) {
        throw new BadRequestError('Error occurred when getting all features')
    }

    return listFeatures
}

module.exports = {
    getAllFeatures
}
