const { categoryService } = require('../services')
const { OK } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

const getAllCategories = async (req, res) => {
    const listCategories = await categoryService.getAllCategories()
    new OK({
        message: SUCCESS_MESSAGES.CATEGORY.GET_CATEGORIES,
        metaData: listCategories
    }).send(res)
}

module.exports = {
    getAllCategories
}
