const { Op } = require('sequelize')
const db = require('..')
const { BadRequestError, NotFoundError } = require('../../core/error.response')
const { paginatedData, isValidKeyOfModel } = require('../../utils')
const { SCOPES, COMMON_EXCLUDE_ATTRIBUTES, PAGINATION_DEFAULT } = require('../../core/data.constant')
const { ERROR_MESSAGES } = require('../../core/message.constant')
const { getUserById } = require('./user.repo')

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

const getScopesArray = (scopes) => scopes.map((scope) => propertyScopes[scope])

const validatePropertyOptions = async ({ propertyOptions }) => {
    const {
        userId,
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
        limit = PAGINATION_DEFAULT.PROPERTY.LIMIT,
        page = PAGINATION_DEFAULT.PROPERTY.PAGE,
        orderBy = PAGINATION_DEFAULT.PROPERTY.ORDER_BY,
        sortBy = PAGINATION_DEFAULT.PROPERTY.SORT_BY
    } = propertyOptions

    const options = {}
    const queries = { limit, page, sortBy, orderBy }

    if (userId) {
        const user = await getUserById(userId)
        if (!user) {
            throw new BadRequestError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
        }
        options.userId = userId
    }

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
        validateAndAssign(db.Features, 'featureId', featureId, ERROR_MESSAGES.FEATURE.INVALID),
        validateAndAssign(db.Categories, 'categoryId', categoryId, ERROR_MESSAGES.CATEGORY.INVALID),
        validateAndAssign(
            db.Provinces,
            '$location.provinceCode$',
            provinceCode,
            ERROR_MESSAGES.LOCATION.INVALID_PROVINCE
        ),
        validateAndAssign(
            db.Districts,
            '$location.districtCode$',
            districtCode,
            ERROR_MESSAGES.LOCATION.INVALID_DISTRICT
        ),
        validateAndAssign(db.Wards, '$location.wardCode$', wardCode, ERROR_MESSAGES.LOCATION.INVALID_WARD)
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
        include: getScopesArray(SCOPES.PROPERTY.USER_GET),
        where: validOptions,
        distinct: true,
        attributes: { exclude: COMMON_EXCLUDE_ATTRIBUTES.PROPERTY },
        offset: (page - 1) * limit,
        limit,
        order: [[orderBy, sortBy]]
    })

    if (!propertiesData) {
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.GET_ALL)
    }

    return paginatedData({ data: propertiesData, page, limit })
}

const getAllPropertiesBySellerOptions = async ({ validOptions, queries, sellerId }) => {
    const { page, limit, orderBy, sortBy } = queries
    const propertiesData = await db.Properties.findAndCountAll({
        where: { ...validOptions, userId: sellerId },
        include: getScopesArray(SCOPES.PROPERTY.SELLER_GET),
        attributes: { exclude: COMMON_EXCLUDE_ATTRIBUTES.PROPERTY },
        distinct: true,
        offset: (page - 1) * limit,
        limit,
        order: [[orderBy, sortBy]]
    })

    if (!propertiesData) {
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.GET_ALL)
    }

    return paginatedData({ data: propertiesData, page, limit })
}

const getProperty = async (propertyId) => {
    try {
        const property = await db.Properties.findOne({
            include: getScopesArray(SCOPES.PROPERTY.USER_GET),
            where: { propertyId },
            attributes: { exclude: COMMON_EXCLUDE_ATTRIBUTES.PROPERTY }
        })
        if (!property) {
            throw new NotFoundError(ERROR_MESSAGES.PROPERTY.NOT_FOUND)
        }

        return property
    } catch (error) {
        if (error instanceof NotFoundError) throw error
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.GET)
    }
}

const getPropertyBySeller = async ({ userId, propertyId }) => {
    try {
        const property = await db.Properties.findOne({
            include: getScopesArray(SCOPES.PROPERTY.SELLER_GET),
            where: { userId, propertyId },
            attributes: { exclude: COMMON_EXCLUDE_ATTRIBUTES.PROPERTY }
        })
        if (!property) {
            throw new NotFoundError(ERROR_MESSAGES.PROPERTY.NOT_FOUND)
        }

        return property
    } catch (error) {
        if (error instanceof NotFoundError) throw error
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.GET)
    }
}

const createNewProperty = async ({ propertyOptions, userId, locationId }) => {
    const newProperty = await db.Properties.create({
        ...propertyOptions,
        locationId,
        userId
    })

    if (!newProperty) {
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.CREATE)
    }

    return newProperty
}

const updateProperty = async ({ propertyId, userId, updatedData }) => {
    const property = await db.Properties.findOne({
        where: { propertyId, userId }
    })
    if (!property) {
        throw new NotFoundError(ERROR_MESSAGES.PROPERTY.NOT_FOUND)
    }

    const updatedProperty = await db.Properties.update(updatedData, { where: { propertyId, userId } })
    if (!updatedProperty[0]) {
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.UPDATE)
    }

    return updatedProperty[0]
}

const deleteProperty = async ({ propertyId, userId }) => {
    const property = await db.Properties.findOne({
        where: { propertyId, userId }
    })
    if (!property) throw new NotFoundError(ERROR_MESSAGES.PROPERTY.NOT_FOUND)

    const deleted = await db.Locations.destroy({ where: { locationId: property.locationId } })
    if (!deleted) throw new BadRequestError(ERROR_MESSAGES.PROPERTY.DELETE)
}

const updatePropertyStatus = async (propertyId) => {
    const property = await db.Properties.findByPk(propertyId)
    if (!property) throw new NotFoundError(ERROR_MESSAGES.PROPERTY.NOT_FOUND)

    const updatedStatus = !property.status
    const updated = await db.Properties.update({ status: updatedStatus }, { where: { propertyId } })
    if (!updated[0]) throw new BadRequestError(ERROR_MESSAGES.PROPERTY.UPDATE_STATUS)

    return updatedStatus
}

module.exports = {
    propertyScopes,
    getScopesArray,
    deleteProperty,
    updateProperty,
    createNewProperty,
    getPropertyBySeller,
    validatePropertyOptions,
    getAllPropertiesByOptions,
    getProperty,
    getAllPropertiesBySellerOptions,
    updatePropertyStatus
}
