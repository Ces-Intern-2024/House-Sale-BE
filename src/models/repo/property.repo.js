const { Op } = require('sequelize')
const db = require('..')
const { BadRequestError, NotFoundError } = require('../../core/error.response')
const { paginatedData, transformPropertyData, isValidKeyOfModel } = require('../../utils')

const propertyScopes = {
    feature: {
        model: db.Features,
        attributes: ['featureId', 'name'],
        as: 'feature',
        required: true
    },
    category: {
        model: db.Categories,
        attributes: ['categoryId', 'name'],
        as: 'category',
        required: true
    },
    location: {
        model: db.Locations,
        as: 'location',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        required: true
    },
    images: {
        model: db.Images,
        as: 'images',
        attributes: ['imageId', 'imageUrl'],
        required: true
    },
    seller: {
        model: db.Users,
        as: 'seller',
        attributes: ['userId', 'fullName', 'email', 'phone', 'avatar'],
        required: true
    }
}
const userScopes = ['feature', 'category', 'location', 'images', 'seller']
const sellerScopes = ['feature', 'category', 'location', 'images']
const commonExcludeAttributes = ['userId', 'featureId', 'categoryId', 'locationId']

const getScopesArray = (scopes) => scopes.map((scope) => propertyScopes[scope])

const validatePropertyOptions = async ({ propertyOptions }) => {
    const {
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
        orderBy = 'createdAt',
        sortBy = 'desc'
    } = propertyOptions

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
        if (from !== undefined && to !== undefined) {
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
        include: getScopesArray(userScopes),
        where: validOptions,
        distinct: true,
        attributes: { exclude: commonExcludeAttributes },
        offset: (page - 1) * limit,
        limit,
        order: [[orderBy, sortBy]]
    })

    if (!propertiesData) {
        throw new BadRequestError('Error ocurred when find properties')
    }

    return paginatedData({ data: propertiesData, page, limit })
}

const getAllPropertiesBySellerOptions = async ({ validOptions, queries, sellerId }) => {
    const { page, limit, orderBy, sortBy } = queries
    const propertiesData = await db.Properties.findAndCountAll({
        where: { ...validOptions, userId: sellerId },
        include: getScopesArray(sellerScopes),
        attributes: { exclude: commonExcludeAttributes },
        distinct: true,
        offset: (page - 1) * limit,
        limit,
        order: [[orderBy, sortBy]]
    })

    if (!propertiesData) {
        throw new BadRequestError('Error ocurred when find properties')
    }

    return paginatedData({ data: propertiesData, page, limit })
}

const getProperty = async (propertyId) => {
    const property = await db.Properties.findOne({
        include: getScopesArray(userScopes),
        where: { propertyId }
    })

    if (!property) {
        throw new BadRequestError('This property is not available now. Please try another property!')
    }

    return transformPropertyData(property)
}

const getPropertyBySeller = async ({ userId, propertyId }) => {
    const property = await db.Properties.findOne({
        include: getScopesArray(sellerScopes),
        where: { userId, propertyId }
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

const updateProperty = async ({ propertyId, userId, updatedData }) => {
    const property = await db.Properties.findOne({
        where: { propertyId, userId }
    })
    if (!property) {
        throw new NotFoundError('This property is not available now. Please try another property!')
    }

    const updatedProperty = await db.Properties.update(updatedData, { where: { propertyId, userId } })
    if (!updatedProperty[0]) {
        throw new BadRequestError('Failed to update property')
    }

    return updatedProperty[0]
}

const deleteProperty = async ({ propertyId, userId }) => {
    const property = await db.Properties.findOne({
        where: { propertyId, userId }
    })
    if (!property) throw new NotFoundError('This property is not available now. Please try another property!')

    const deleted = await db.Locations.destroy({ where: { locationId: property.locationId } })
    if (!deleted) throw new BadRequestError('Failed to delete property')
}

module.exports = {
    propertyScopes,
    userScopes,
    sellerScopes,
    getScopesArray,
    deleteProperty,
    updateProperty,
    createNewProperty,
    getPropertyBySeller,
    validatePropertyOptions,
    getAllPropertiesByOptions,
    getProperty,
    getAllPropertiesBySellerOptions
}
