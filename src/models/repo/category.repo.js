const { Op } = require('sequelize')
const db = require('..')
const { COMMON_EXCLUDE_ATTRIBUTES } = require('../../core/data.constant')
const { BadRequestError, NotFoundError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')

const deleteCategory = async (categoryId) => {
    try {
        const existingCategory = await db.Categories.findOne({
            where: { categoryId }
        })

        if (!existingCategory) {
            throw new NotFoundError(ERROR_MESSAGES.CATEGORY.NOT_FOUND)
        }

        const deletedCategory = await db.Categories.destroy({
            where: { categoryId }
        })

        if (!deletedCategory) throw new BadRequestError(ERROR_MESSAGES.CATEGORY.DELETE)
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof BadRequestError) throw error
        throw new BadRequestError(ERROR_MESSAGES.CATEGORY.DELETE)
    }
}

const updateCategory = async ({ categoryId, categoryName }) => {
    try {
        const category = await db.Categories.findOne({
            where: { categoryId }
        })
        if (!category) throw new NotFoundError(ERROR_MESSAGES.CATEGORY.NOT_FOUND)

        if (category.name === categoryName) throw new BadRequestError(ERROR_MESSAGES.CATEGORY.SAME_NAME)

        const existingCategoryName = await db.Categories.findOne({
            where: { name: categoryName, categoryId: { [Op.ne]: categoryId } }
        })
        if (existingCategoryName) throw new BadRequestError(ERROR_MESSAGES.CATEGORY.DUPLICATE_NAME)

        const [updatedCategory] = await db.Categories.update(
            { name: categoryName },
            {
                where: { categoryId }
            }
        )

        if (!updatedCategory) throw new BadRequestError(ERROR_MESSAGES.CATEGORY.UPDATE)
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof BadRequestError) throw error
        throw new BadRequestError(ERROR_MESSAGES.CATEGORY.UPDATE)
    }
}

const createCategory = async (categoryName) => {
    try {
        const [newCategory, created] = await db.Categories.findOrCreate({
            where: {
                name: categoryName
            }
        })
        if (!created) throw new BadRequestError(ERROR_MESSAGES.CATEGORY.EXISTED_CATEGORY)

        return newCategory
    } catch (error) {
        if (error instanceof BadRequestError) throw error
        throw new BadRequestError(ERROR_MESSAGES.CATEGORY.CREATE)
    }
}

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
    deleteCategory,
    updateCategory,
    createCategory,
    getAllCategories
}
