const db = require('../models')
const { BadRequestError } = require('../core/error.response')

const isValidPK = async (model, id, errorMessage) => {
    if (!id) {
        return null
    }

    const validEntity = await model.findByPk(id)
    if (!validEntity) {
        throw new BadRequestError(errorMessage)
    }
    return validEntity
}

const getAllProperties = async ({ featureId, categoryId, districtId }) => {
    const conditions = {}

    if (featureId) {
        conditions['$feature.featureId$'] = (await isValidPK(
            db.Features,
            featureId,
            'This feature is not available yet. Please try again.'
        ))
            ? featureId
            : null
    }
    if (categoryId) {
        conditions['$category.categoryId$'] = (await isValidPK(
            db.Categories,
            categoryId,
            'This category is not available yet. Please try again.'
        ))
            ? categoryId
            : null
    }
    if (districtId) {
        conditions['$district.districtId$'] = (await isValidPK(
            db.Districts,
            districtId,
            'This district is not available yet. Please try again.'
        ))
            ? districtId
            : null
    }

    const properties = await db.Properties.findAll({
        include: [
            { model: db.Features, attributes: ['name'], as: 'feature' },
            { model: db.Categories, attributes: ['name'], as: 'category' },
            { model: db.Districts, attributes: ['name'], as: 'district' }
        ],
        where: conditions,
        attributes: { exclude: ['categoryId', 'featureId', 'districtId'] },
        raw: true
    })
    if (!properties) {
        throw new BadRequestError('Error ocurred when find properties')
    }

    const transformedProperties = properties.map((property) => {
        const {
            'category.name': categoryName,
            'feature.name': featureName,
            'district.name': districtName,
            ...rest
        } = property
        return {
            ...rest,
            feature: featureName,
            category: categoryName,
            district: districtName
        }
    })

    return transformedProperties
}

module.exports = {
    getAllProperties
}
