const { Op } = require('sequelize')
const db = require('..')
const { BadRequestError } = require('../../core/error.response')
const { mapAndTransformProperties, transformPropertyData, isValidKeyOfModel } = require('../../utils')

const propertyScopes = {
    feature: {
        model: db.Features,
        attributes: ['featureId', 'name'],
        as: 'feature'
    },
    category: {
        model: db.Categories,
        attributes: ['categoryId', 'name'],
        as: 'category'
    },
    location: {
        model: db.Locations,
        as: 'location',
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    },
    images: {
        model: db.Images,
        as: 'images',
        attributes: ['imageUrl']
    },
    seller: {
        model: db.Users,
        as: 'seller'
    }
}
const getAllPropertiesScopes = ['feature', 'category', 'location', 'images', 'seller']
const getAllPropertiesBySellerScopes = ['feature', 'category', 'location', 'images']

const getScopesArray = (scopes) => scopes.map((scope) => propertyScopes[scope])

const validatePropertyOptions = async ({
    keyword,
    featureId,
    categoryId,
    provinceCode,
    districtCode,
    wardCode,
    priceFrom,
    priceTo,
    landAreaFrom,
    landAreaTo,
    areaOfUseFrom,
    areaOfUseTo,
    numberOfFloorFrom,
    numberOfFloorTo,
    numberOfBedRoomFrom,
    numberOfBedRoomTo,
    numberOfToiletFrom,
    numberOfToiletTo,
    direction,
    limit = 10,
    page = 1,
    orderBy = 'name',
    sortBy = 'asc'
}) => {
    const options = {}
    const queries = { limit, page, sortBy, orderBy }

    if (keyword) {
        const validKeyword = keyword.replace(/"/g, '').trim()
        options.name = {
            [Op.substring]: validKeyword
        }
    }

    const validateAndAssign = async (model, key, value, errorMessage) => {
        if (value) {
            const validValue = await isValidKeyOfModel(model, value, errorMessage)
            if (validValue) {
                options[key] = validValue
            }
        }
    }

    const validateAndAssignRange = (key, from, to) => {
        if (from && to) {
            options[key] = { [Op.between]: [from, to] }
        }
    }

    await Promise.all([
        validateAndAssign(db.Features, 'featureId', featureId, 'This feature is not available yet. Please try again.'),
        validateAndAssign(
            db.Categories,
            'categoryId',
            categoryId,
            'This category is not available yet. Please try again.'
        ),
        validateAndAssign(
            db.Provinces,
            '$location.provinceCode$',
            provinceCode,
            'This province is not available yet. Please try again.'
        ),
        validateAndAssign(
            db.Districts,
            '$location.districtCode$',
            districtCode,
            'This district is not available yet. Please try again.'
        ),
        validateAndAssign(
            db.Wards,
            '$location.wardCode$',
            wardCode,
            'This ward is not available yet. Please try again.'
        )
    ])

    validateAndAssignRange('price', priceFrom, priceTo)
    validateAndAssignRange('landArea', landAreaFrom, landAreaTo)
    validateAndAssignRange('areaOfUse', areaOfUseFrom, areaOfUseTo)
    validateAndAssignRange('numberOfFloor', numberOfFloorFrom, numberOfFloorTo)
    validateAndAssignRange('numberOfBedRoom', numberOfBedRoomFrom, numberOfBedRoomTo)
    validateAndAssignRange('numberOfToilet', numberOfToiletFrom, numberOfToiletTo)

    if (direction) {
        options.direction = direction
    }

    return { validOptions: options, queries }
}

const getAllPropertiesByOptions = async ({ validOptions, queries }) => {
    const { page, limit, orderBy, sortBy } = queries
    const propertiesData = await db.Properties.findAndCountAll({
        include: getScopesArray(getAllPropertiesScopes),
        distinct: true,
        where: validOptions,
        offset: (page - 1) * limit,
        limit,
        order: [[orderBy, sortBy]]
    })

    if (!propertiesData) {
        throw new BadRequestError('Error ocurred when find properties')
    }

    return mapAndTransformProperties({ propertiesData, page, limit })
}

const getAllPropertiesBySellerOptions = async ({ validOptions, queries, sellerId }) => {
    const { page, limit, orderBy, sortBy } = queries
    const propertiesData = await db.Properties.findAndCountAll({
        include: getScopesArray(getAllPropertiesBySellerScopes),
        where: { ...validOptions, userId: sellerId },
        distinct: true,
        offset: (page - 1) * limit,
        limit,
        order: [[orderBy, sortBy]]
    })

    if (!propertiesData) {
        throw new BadRequestError('Error ocurred when find properties')
    }

    return mapAndTransformProperties({ propertiesData, page, limit })
}

const getPropertyByOptions = async (options) => {
    const property = await db.Properties.findOne({
        include: getScopesArray(getAllPropertiesScopes),
        where: options
    })

    if (!property) {
        throw new BadRequestError('This property is not available now. Please try another property!')
    }

    return transformPropertyData(property)
}

const createNewProperty = async ({ propertyOptions, userId, locationId }) => {
    const newProperty = await db.Properties.create({
        ...propertyOptions,
        locationId,
        userId
    })
    if (!newProperty) {
        throw new BadRequestError('Error occurred when create your property!')
    }

    return newProperty
}

module.exports = {
    createNewProperty,
    validatePropertyOptions,
    getAllPropertiesByOptions,
    getPropertyByOptions,
    getAllPropertiesBySellerOptions
}
