const { categoryService } = require('../services')
const { OK } = require('../core/success.response')

const getAllCategories = async (req, res) => {
    const listCategories = await categoryService.getAllCategories()
    new OK({
        message: 'Get list categories success!',
        metaData: listCategories
    }).send(res)
}

module.exports = {
    getAllCategories
}
