const db = require('..')

const getAllCategories = async () => {
    return db.Categories.findAll({
        attributes: ['categoryId', 'name']
    })
}

module.exports = {
    getAllCategories
}
