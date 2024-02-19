const { BadRequestError } = require('../core/error.response')
const { categoryRepo } = require('../models/repo')

const getAllCategories = async () => {
    const listCategories = await categoryRepo.getAllCategories()
    if (!listCategories) {
        throw new BadRequestError('Error occurred when getting all categories')
    }

    return listCategories
}

module.exports = {
    getAllCategories
}
