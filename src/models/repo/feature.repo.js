const db = require('..')
const { COMMON_EXCLUDE_ATTRIBUTES } = require('../../core/data.constant')
const { BadRequestError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')

const getAllFeatures = async () => {
    try {
        return db.Features.findAll({
            attributes: { exclude: COMMON_EXCLUDE_ATTRIBUTES.FEATURE }
        })
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.FEATURE.GET_FEATURES)
    }
}

module.exports = {
    getAllFeatures
}
