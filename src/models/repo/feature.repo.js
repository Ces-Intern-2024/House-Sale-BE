const db = require('..')

const getAllFeatures = async () => {
    return db.Features.findAll({
        attributes: ['featureId', 'name']
    })
}

module.exports = {
    getAllFeatures
}
