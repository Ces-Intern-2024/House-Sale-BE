const db = require('..')
const { BadRequestError, NotFoundError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')

const validateServiceId = (serviceId) => {
    if (!serviceId) {
        throw new BadRequestError(ERROR_MESSAGES.SERVICE.SERVICE_ID_IS_REQUIRED)
    }
}

const getServiceById = async (serviceId) => {
    validateServiceId(serviceId)

    try {
        const service = await db.Services.findByPk(serviceId)
        return service ? service.get({ plain: true }) : null
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.SERVICE.GET_SERVICE_BY_ID)
    }
}

const findService = async (serviceId) => {
    const service = await getServiceById(serviceId)
    if (!service) {
        throw new NotFoundError(ERROR_MESSAGES.SERVICE.SERVICE_NOT_FOUND)
    }

    return service
}

const getAllServices = async () => {
    try {
        return db.Services.findAll()
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.SERVICE.GET_ALL_SERVICES)
    }
}

const createService = async (serviceBody) => {
    try {
        await db.Services.create(serviceBody)
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.SERVICE.CREATE_SERVICE)
    }
}

const updateService = async (serviceId, updateBody) => {
    try {
        const service = await findService(serviceId)
        if (updateBody.price && Number(service.price) === Number(updateBody.price)) {
            throw new BadRequestError(ERROR_MESSAGES.SERVICE.SAME_PRICE)
        }

        if (updateBody.serviceName && service.serviceName === updateBody.serviceName) {
            throw new BadRequestError(ERROR_MESSAGES.SERVICE.SAME_SERVICE_NAME)
        }

        if (updateBody.duration && Number(service.duration) === Number(updateBody.duration)) {
            throw new BadRequestError(ERROR_MESSAGES.SERVICE.SAME_DURATION)
        }

        await db.Services.update(updateBody, { where: { serviceId } })
    } catch (error) {
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.SERVICE.UPDATE_SERVICE)
    }
}

const deleteService = async (serviceId, transaction) => {
    try {
        await findService(serviceId)
        const deleted = await db.Services.destroy({ where: { serviceId }, transaction })
        if (!deleted) {
            throw new BadRequestError(ERROR_MESSAGES.SERVICE.DELETE_SERVICE)
        }
    } catch (error) {
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.SERVICE.DELETE_SERVICE)
    }
}

const deleteListServices = async (serviceIds) => {
    const transaction = await db.sequelize.transaction()
    try {
        await Promise.all(serviceIds.map((serviceId) => deleteService(serviceId, transaction)))
        await transaction.commit()
    } catch (error) {
        await transaction.rollback()
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.SERVICE.DELETE_LIST_SERVICE)
    }
}

module.exports = {
    deleteListServices,
    updateService,
    getServiceById,
    validateServiceId,
    findService,
    createService,
    getAllServices
}
