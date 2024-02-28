const { featureRepo } = require('../models/repo')

/**
 * Get all features
 * @returns {Promise<Feature>}
 */
const getAllFeatures = async () => {
    return featureRepo.getAllFeatures()
}

module.exports = {
    getAllFeatures
}
