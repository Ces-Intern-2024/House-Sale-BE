const db = require('../models')
const { BadRequestError } = require('../core/error.response')
const { isValidKeyOfModel, transformPropertyData } = require('../utils')

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

    const properties = await db.Properties.scope(
        'includeImages',
        'includeCategory',
        'includeFeature',
        'includeLocation'
    ).findAll({
        include: [
            {
                model: db.Users,
                as: 'seller'
            }
        ],
        where: conditions
    })

    if (!properties) {
        throw new BadRequestError('Error ocurred when find properties')
    }

    const updatedProperties = properties.map((property) => transformPropertyData(property))

    return { count: properties.length, properties: updatedProperties }
}

const getProperty = async (propertyId) => {
    const property = await db.Properties.scope(
        'includeImages',
        'includeCategory',
        'includeFeature',
        'includeLocation'
    ).findOne({
        include: [
            {
                model: db.Users,
                as: 'seller'
            }
        ],
        where: { propertyId }
    })

    if (!property) {
        throw new BadRequestError('This property is not available now. Please try another property!')
    }

    const updatedProperty = transformPropertyData(property)

    return updatedProperty
}

module.exports = {
    getAllProperties,
    getProperty
}
