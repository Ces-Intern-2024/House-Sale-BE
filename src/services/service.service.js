const { BadRequestError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')
const db = require('../models')

/**
 * Create a new service
 * @param {Object} params
 * @param {string} params.serviceName - Name of the service
 * @param {number} params.price - Price of the service
 * @returns {Promise<boolean>}
 */
const createService = async (serviceBody) => {
    try {
        await db.Services.create(serviceBody)
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.SERVICE.CREATE_SERVICE)
    }
}

/**
 * Get all services
 * @returns {Promise<Service>}

 */
const getAllServices = async () => {
    try {
        return db.Services.findAll()
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.SERVICE.GET_ALL_SERVICES)
    }
}

module.exports = {
    createService,
    getAllServices
}
