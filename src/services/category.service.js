const { categoryRepo } = require('../models/repo')

/**
 * Get all categories
 * @returns {Promise<Category>}

 */
const getAllCategories = async () => {
    return categoryRepo.getAllCategories()
}

module.exports = {
    getAllCategories
}
