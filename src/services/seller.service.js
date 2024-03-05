const { ROLE_NAME, SERVICES, TRANSACTION } = require('../core/data.constant')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')
const db = require('../models')
const { propertyRepo, locationRepo } = require('../models/repo')

const createProperty = async ({ propertyBody, userId }) => {
    const transaction = await db.sequelize.transaction()
    try {
        const user = await db.Users.findOne({ where: { userId } })
        if (!user) {
            throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
        }

        const { provinceCode, districtCode, wardCode, street, address, images, ...propertyOptions } = propertyBody
        // check balance
        const { balance } = user
        const serviceId = SERVICES.CREATE_NEW_PROPERTY.ID

        const service = await db.Services.findOne({
            where: { serviceId }
        })
        if (!service) {
            throw new BadRequestError(ERROR_MESSAGES.SERVICE.SERVICE_NOT_FOUND)
        }
        const { price } = service
        if (balance < price) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.NOT_ENOUGH_CREDIT)
        }

        // create location
        await locationRepo.checkLocation({ provinceCode, districtCode, wardCode })
        const newLocation = await db.Locations.create(
            {
                provinceCode,
                districtCode,
                wardCode,
                address,
                street
            },
            { transaction }
        )
        if (!newLocation) {
            throw new BadRequestError(ERROR_MESSAGES.LOCATION.CREATE_NEW_LOCATION)
        }

        // create property
        const newProperty = await db.Properties.create(
            {
                ...propertyOptions,
                locationId: newLocation.locationId,
                userId
            },
            { transaction }
        )
        if (!newProperty) {
            throw new BadRequestError(ERROR_MESSAGES.PROPERTY.CREATE)
        }

        // save property images
        const savedPropertyImages = await Promise.all(
            images.map((imageUrl) => {
                return db.Images.create(
                    {
                        propertyId: newProperty.propertyId,
                        imageUrl
                    },
                    { transaction }
                )
            })
        )
        if (!savedPropertyImages) {
            throw new BadRequestError(ERROR_MESSAGES.IMAGE.SAVING_IMAGE_FAILED)
        }

        // create rent service transaction and update user balance
        const newRentServiceTransaction = await db.RentServiceTransactions.create(
            {
                userId,
                amount: price,
                balance: Number(balance) - Number(price),
                serviceId,
                description: TRANSACTION.EXPENSE_DESC(newProperty.propertyId)
            },
            { transaction }
        )
        if (!newRentServiceTransaction) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.FAILED_TO_PROCESS_RENT_SERVICE_TRANSACTION)
        }

        const updatedUser = await user.decrement({ balance: price }, { transaction })
        if (!updatedUser) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.FAILED_TO_UPDATE_USER_BALANCE)
        }

        await transaction.commit()
    } catch (error) {
        await transaction.rollback()
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.PROPERTY.CREATE)
    }
}

/**
 * Delete property of seller by propertyId, sellerId
 * @param {Object} params
 * @param {id} propertyId - id of property
 * @param {id} userId - id of seller
 * @returns {Promise<boolean>}
 */
const deleteProperty = async ({ propertyId, userId }) => {
    return propertyRepo.deleteProperty({ propertyId, userId })
}

/**
 * Update property status of seller by propertyId, sellerId
 * @param {Object} params
 * @param {id} propertyId - id of property
 * @param {id} userId - id of seller
 * @param {string} status - status of property
 * @returns {Promise<boolean>}
 */
const updatePropertyStatus = async ({ propertyId, status, userId }) => {
    return propertyRepo.updatePropertyStatus({ propertyId, status, userId, role: ROLE_NAME.SELLER })
}

/**
 * Update property of seller by sellerId, propertyId
 * @param {Object} params
 * @param {id} params.propertyId
 * @param {id} params.userId - sellerId
 * @param {id} params.updatedData - updated information of property
 * @returns {Promise<boolean>}
 */
const updateProperty = async ({ propertyId, userId, updatedData }) => {
    return propertyRepo.updateProperty({ propertyId, userId, updatedData, role: ROLE_NAME.SELLER })
}

/** Get property of seller by propertyId
 * @param {Object} params
 * @param {id} params.propertyId - propertyId
 * @param {id} params.sellerId -sellerId
 * @returns {Promise<Property>}
 */
const getProperty = async ({ propertyId, userId }) => {
    return propertyRepo.getProperty({ propertyId, userId, role: ROLE_NAME.SELLER })
}

/**
 * Get all properties of seller by options: keyword, featureId, categoryId,...
 * @param {Object} params
 * @param {Object} params.options - keyword, featureId, categoryId,...
 * @param {id} params.userId -userId of seller
 * @returns {Promise<Properties>}
 */
const getAllProperties = async ({ options, userId }) => {
    const { validOptions, queries } = await propertyRepo.validatePropertyOptions({
        propertyOptions: options,
        role: ROLE_NAME.SELLER
    })
    return propertyRepo.getAllProperties({ validOptions, queries, userId, role: ROLE_NAME.SELLER })
}

module.exports = {
    createProperty,
    deleteProperty,
    updatePropertyStatus,
    updateProperty,
    getProperty,
    getAllProperties
}
