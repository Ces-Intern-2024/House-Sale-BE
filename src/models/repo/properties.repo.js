const { BadRequestError } = require('../../core/error.response')
const db = require('..')
const { mapAndTransformProperties, transformPropertyData } = require('../../utils')

const commonScope = ['includeImages', 'includeCategory', 'includeFeature', 'includeLocation']

const getAllPropertiesByConditions = async (conditions) => {
    const properties = await db.Properties.scope(commonScope).findAll({
        include: [
            {
                model: db.Users,
                as: 'seller'
            }
        ],
        where: {
            ...conditions
        }
    })

    if (!properties) {
        throw new BadRequestError('Error ocurred when find properties')
    }

    return mapAndTransformProperties(properties)
}

const getPropertyByConditions = async (conditions) => {
    const property = await db.Properties.scope(commonScope).findOne({
        include: [
            {
                model: db.Users,
                as: 'seller'
            }
        ],
        where: { ...conditions }
    })

    if (!property) {
        throw new BadRequestError('This property is not available now. Please try another property!')
    }

    return transformPropertyData(property)
}

module.exports = {
    getAllPropertiesByConditions,
    getPropertyByConditions
}
