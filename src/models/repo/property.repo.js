const moment = require('moment-timezone')
const { Op } = require('sequelize')
const db = require('..')
const { BadRequestError, NotFoundError } = require('../../core/error.response')
const { paginatedData, isValidKeyOfModel, calculateSavedRemainingRentalTime } = require('../../utils')
const {
    SCOPES,
    COMMON_EXCLUDE_ATTRIBUTES,
    PAGINATION_DEFAULT,
    COMMON_SCOPES,
    PROPERTY_STATUS_PERMISSION,
    ROLE_NAME,
    PROPERTY_STATUS,
    TRANSACTION,
    TIMEZONE
} = require('../../core/data.constant')
const { ERROR_MESSAGES } = require('../../core/message.constant')
const { findUserById } = require('./user.repo')
const { findService } = require('./service.repo')
const { checkBalance, createRentServiceTransactionAndUpdateUserBalance } = require('./transaction.repo')

const getScopesArray = (scopes) => scopes.map((scope) => COMMON_SCOPES[scope])

const validatePropertyOptions = async ({ propertyOptions, role = ROLE_NAME.USER }) => {
    try {
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
            orderBy,
            sortBy
        } = propertyOptions

        const options = {}
        const queries = {
            limit,
            page,
            sortBy,
            order: [[PAGINATION_DEFAULT.PROPERTY.ORDER_BY, PAGINATION_DEFAULT.PROPERTY.SORT_BY]]
        }
        if ((orderBy && !sortBy) || (!orderBy && sortBy)) {
            throw new BadRequestError(ERROR_MESSAGES.PROPERTY.BOTH_ORDER_BY_SORT_BY)
        }

        if (orderBy === PAGINATION_DEFAULT.PROPERTY.ORDER_BY && sortBy !== PAGINATION_DEFAULT.PROPERTY.SORT_BY) {
            queries.order = [[PAGINATION_DEFAULT.PROPERTY.ORDER_BY, sortBy]]
        }
        if (orderBy && sortBy && orderBy !== PAGINATION_DEFAULT.PROPERTY.ORDER_BY) {
            queries.order.unshift([orderBy, sortBy])
        }

        if (role === ROLE_NAME.USER) {
            options.status = PROPERTY_STATUS_PERMISSION.GET_ALL.User
        }

        if (userId) {
            await findUserById(userId)
            options.userId = userId
        }

        if (keyword) {
            const validKeyword = keyword.replace(/"/g, '').trim()
            options.name = {
                [Op.substring]: validKeyword
            }
        }

        if (featureId) {
            const featureIds = featureId.split(',')

            const validFeatureIds = await Promise.all(
                featureIds.map(async (id) => {
                    const validId = await isValidKeyOfModel(db.Features, id, ERROR_MESSAGES.FEATURE.INVALID)
                    return validId || null
                })
            ).then((ids) => ids.filter(Boolean))

            if (validFeatureIds.length > 0) {
                options.featureId = { [Op.in]: validFeatureIds }
            }
        }

        if (categoryId) {
            const categoryIds = categoryId.split(',')

            const validCategoryIds = await Promise.all(
                categoryIds.map(async (id) => {
                    const validId = await isValidKeyOfModel(db.Categories, id, ERROR_MESSAGES.CATEGORY.INVALID)
                    return validId || null
                })
            ).then((ids) => ids.filter(Boolean))

            if (validCategoryIds.length > 0) {
                options.categoryId = { [Op.in]: validCategoryIds }
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
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.VALIDATE_OPTIONS)
    }
}

const getAllProperties = async ({ validOptions, queries, userId, role = ROLE_NAME.USER }) => {
    const { page, limit, order } = queries

    const where = userId ? { ...validOptions, userId } : validOptions
    const propertiesData = await db.Properties.findAndCountAll({
        include: getScopesArray(SCOPES.PROPERTY.GET_ALL[role]),
        where,
        distinct: true,
        attributes: { exclude: COMMON_EXCLUDE_ATTRIBUTES.PROPERTY },
        offset: (Number(page) - 1) * Number(limit),
        limit: Number(limit),
        order
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

const updateProperty = async ({ propertyId, userId, updatedData, role = ROLE_NAME.SELLER }) => {
    const where = userId ? { propertyId, userId } : { propertyId }
    const property = await db.Properties.findOne({ where: { ...where, status: PROPERTY_STATUS_PERMISSION.GET[role] } })
    if (!property) {
        throw new NotFoundError(ERROR_MESSAGES.PROPERTY.NOT_FOUND)
    }

    const [updatedProperty] = await db.Properties.update(updatedData, {
        where: { ...where, status: PROPERTY_STATUS_PERMISSION.UPDATE[role] }
    })
    if (!updatedProperty) {
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

const updatePropertyStatusFromAvailableToUnavailable = async ({ propertyId, expiresAt }, transaction) => {
    const savedRemainingRentalTime = calculateSavedRemainingRentalTime(expiresAt)
    const [updated] = await db.Properties.update(
        { status: PROPERTY_STATUS.UNAVAILABLE, savedRemainingRentalTime, expiresAt: null },
        {
            where: {
                propertyId,
                status: PROPERTY_STATUS.AVAILABLE
            },
            transaction
        }
    )
    if (!updated) throw new BadRequestError(ERROR_MESSAGES.PROPERTY.UPDATE_STATUS)
}

const updatePropertyStatusFromUnavailableToAvailable = async (
    { propertyId, userId, balance, serviceId, savedRemainingRentalTime },
    transaction
) => {
    let price = 0
    let duration = 0

    if (savedRemainingRentalTime <= 0 && !serviceId) {
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.NEED_CHOOSE_SERVICE_UPDATE_STATUS)
    }

    if (serviceId) {
        const service = await findService(serviceId)
        price = service.price
        duration = service.duration
        checkBalance(balance, price)
    }

    const expiresAt = moment().tz(TIMEZONE).add(duration, 'days').add(savedRemainingRentalTime, 'ms').toDate()
    await db.Properties.update(
        { status: PROPERTY_STATUS.AVAILABLE, expiresAt, savedRemainingRentalTime: 0 },
        {
            where: {
                propertyId,
                status: PROPERTY_STATUS.UNAVAILABLE
            },
            transaction
        }
    )

    if (serviceId) {
        await createRentServiceTransactionAndUpdateUserBalance(
            {
                userId,
                amount: price,
                balance,
                serviceId,
                description: TRANSACTION.EXPENSE_DESC.UPDATE_STATUS(propertyId)
            },
            transaction
        )
    }
}

const updatePropertyStatus = async ({ userId, propertyId, status, serviceId }) => {
    const { balance } = await findUserById(userId)
    const property = await db.Properties.findOne({
        where: {
            propertyId,
            userId
        }
    })
    if (!property) throw new NotFoundError(ERROR_MESSAGES.PROPERTY.NOT_FOUND)

    if (property.status === PROPERTY_STATUS.DISABLED) {
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.CANNOT_UPDATE_STATUS_DISABLED)
    }

    if (property.status === status) {
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.UPDATE_STATUS_SAME)
    }

    const transaction = await db.sequelize.transaction()
    try {
        if (status === PROPERTY_STATUS.UNAVAILABLE) {
            await updatePropertyStatusFromAvailableToUnavailable(
                { propertyId, expiresAt: property.expiresAt },
                transaction
            )
        }

        if (status === PROPERTY_STATUS.AVAILABLE) {
            await updatePropertyStatusFromUnavailableToAvailable(
                {
                    userId,
                    propertyId,
                    balance,
                    serviceId,
                    savedRemainingRentalTime: property.savedRemainingRentalTime
                },
                transaction
            )
        }

        await transaction.commit()
    } catch (error) {
        await transaction.rollback()
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.UPDATE_STATUS)
    }
}

const createProperty = async ({ propertyOptions, locationId, userId, expiresAt }, transaction) => {
    const newProperty = await db.Properties.create(
        { ...propertyOptions, locationId, userId, expiresAt },
        { transaction }
    )
    if (!newProperty) {
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.CREATE)
    }
    return newProperty
}

const disableProperty = async (propertyId, transaction) => {
    const property = await db.Properties.findOne({ where: { propertyId } })
    if (!property) throw new NotFoundError(ERROR_MESSAGES.PROPERTY.NOT_FOUND)
    if (property.status === PROPERTY_STATUS.DISABLED)
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.CANNOT_UPDATE_STATUS_DISABLED)
    const [updated] = await db.Properties.update(
        { status: PROPERTY_STATUS.DISABLED },
        {
            where: {
                propertyId,
                status: PROPERTY_STATUS_PERMISSION.DISABLED
            },
            transaction
        }
    )
    if (!updated) throw new BadRequestError(ERROR_MESSAGES.PROPERTY.FAILED_TO_DISABLED_PROPERTY)
}

const disableListProperties = async (propertyIds) => {
    const transaction = await db.sequelize.transaction()
    try {
        await Promise.all(propertyIds.map((propertyId) => disableProperty(propertyId, transaction)))
        await transaction.commit()
    } catch (error) {
        await transaction.rollback()
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.FAILED_TO_DISABLED_LIST_PROPERTIES)
    }
}

module.exports = {
    disableListProperties,
    createProperty,
    getScopesArray,
    deleteProperty,
    updateProperty,
    validatePropertyOptions,
    getAllProperties,
    getProperty,
    updatePropertyStatus
}
