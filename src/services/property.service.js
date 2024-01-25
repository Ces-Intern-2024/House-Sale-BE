const { Op } = require('sequelize')
const db = require('../models')
const { isValidKeyOfModel } = require('../utils')
const { propertiesRepo } = require('../models/repo')

const getAllProperties = async ({ featureId, categoryId }) => {
    const conditions = {}
    const validFeatureId = await isValidKeyOfModel(
        db.Features,
        featureId,
        'This feature is not available yet. Please try again.'
    )
    if (validFeatureId) {
        conditions.featureId = validFeatureId
    }
    const validCategoryId = await isValidKeyOfModel(
        db.Categories,
        categoryId,
        'This category is not available yet. Please try again.'
    )
    if (categoryId) {
        conditions.categoryId = validCategoryId
    }

    return propertiesRepo.getAllPropertiesByConditions(conditions)
}

const getProperty = async (propertyId) => {
    const conditions = { propertyId }
    return propertiesRepo.getPropertyByConditions(conditions)
}

const getPropertiesByKeyword = async (keyword) => {
    const formattedKeyword = keyword.trim()
    const conditions = {
        name: {
            [Op.like]: `%${formattedKeyword}%`
        }
    }
    return propertiesRepo.getAllPropertiesByConditions(conditions)
}

module.exports = {
    getAllProperties,
    getProperty,
    getPropertiesByKeyword
}
