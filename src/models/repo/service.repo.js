const db = require('..')
const { BadRequestError } = require('../../core/error.response')
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
        throw new BadRequestError(ERROR_MESSAGES.SERVICE.SERVICE_NOT_FOUND)
    }

    return service
}

module.exports = {
    getServiceById,
    validateServiceId,
    findService
}
