const db = require('..')
const { COMMON_EXCLUDE_ATTRIBUTES } = require('../../core/data.constant')
const { BadRequestError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')

const getAllCategories = async () => {
    try {
        return db.Categories.findAll({
            attributes: { exclude: COMMON_EXCLUDE_ATTRIBUTES.CATEGORY }
        })
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.CATEGORY.GET_CATEGORIES)
    }
}

module.exports = {
    getAllCategories
}
