const { Op } = require('sequelize')
const db = require('..')
const { BadRequestError, NotFoundError } = require('../../core/error.response')
const { paginatedData, isValidKeyOfModel } = require('../../utils')
const {
    SCOPES,
    COMMON_EXCLUDE_ATTRIBUTES,
    PAGINATION_DEFAULT,
    COMMON_SCOPES,
    PROPERTY_STATUS_PERMISSION,
    ROLE_NAME
} = require('../../core/data.constant')
const { ERROR_MESSAGES } = require('../../core/message.constant')
const { getUserById } = require('./user.repo')

const getScopesArray = (scopes) => scopes.map((scope) => COMMON_SCOPES[scope])

const validatePropertyOptions = async ({ propertyOptions, role = ROLE_NAME.USER }) => {
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
    options.status = PROPERTY_STATUS_PERMISSION.GET_ALL[role]
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

const getAllProperties = async ({ validOptions, queries, userId, role = ROLE_NAME.USER }) => {
    const { page, limit, orderBy, sortBy } = queries
    const where = userId ? { ...validOptions, userId } : validOptions
    const propertiesData = await db.Properties.findAndCountAll({
        include: getScopesArray(SCOPES.PROPERTY.GET_ALL[role]),
        where,
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

const getProperty = async ({ propertyId, userId, role = ROLE_NAME.USER }) => {
    const where = userId ? { propertyId, userId } : { propertyId }

    try {
        const property = await db.Properties.findOne({
            include: getScopesArray(SCOPES.PROPERTY.GET[role]),
            where: { ...where, status: PROPERTY_STATUS_PERMISSION.GET[role] },
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

const updateProperty = async ({ propertyId, userId, updatedData, role = ROLE_NAME.SELLER }) => {
    const where = userId ? { propertyId, userId } : { propertyId }
    const property = await db.Properties.findOne({ where: { ...where, status: PROPERTY_STATUS_PERMISSION.GET[role] } })
    if (!property) {
        throw new NotFoundError(ERROR_MESSAGES.PROPERTY.NOT_FOUND)
    }

    const updatedProperty = await db.Properties.update(updatedData, {
        where: { ...where, status: PROPERTY_STATUS_PERMISSION.UPDATE[role] }
    })
    if (!updatedProperty[0]) {
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.UPDATE)
    }
}

const deleteProperty = async ({ propertyId, userId }) => {
    const where = userId ? { propertyId, userId } : { propertyId }
    const property = await db.Properties.findOne({ where })
    if (!property) throw new NotFoundError(ERROR_MESSAGES.PROPERTY.NOT_FOUND)

    const deleted = await db.Locations.destroy({ where: { locationId: property.locationId } })
    if (!deleted) throw new BadRequestError(ERROR_MESSAGES.PROPERTY.DELETE)
}

const updatePropertyStatus = async ({ propertyId, status, userId, role = ROLE_NAME.SELLER }) => {
    const where = userId ? { propertyId, userId } : { propertyId }
    const property = await db.Properties.findOne({ where: { ...where, status: PROPERTY_STATUS_PERMISSION.GET[role] } })
    if (!property) throw new NotFoundError(ERROR_MESSAGES.PROPERTY.NOT_FOUND)

    const updated = await db.Properties.update(
        { status },
        {
            where: {
                ...where,
                status: PROPERTY_STATUS_PERMISSION.UPDATE_STATUS[role]
            }
        }
    )
    if (!updated[0]) throw new BadRequestError(ERROR_MESSAGES.PROPERTY.UPDATE_STATUS)
}

module.exports = {
    getScopesArray,
    deleteProperty,
    updateProperty,
    createNewProperty,
    validatePropertyOptions,
    getAllProperties,
    getProperty,
    updatePropertyStatus
}
