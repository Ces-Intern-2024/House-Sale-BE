const { BadRequestError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')
const db = require('../models')
const { userRepo } = require('../models/repo')

const canRentService = async ({ userId, serviceId }) => {
    try {
        const user = await userRepo.getUserById(userId)
        if (!user) {
            throw new BadRequestError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
        }
        const { balance } = user

        const service = await db.Services.findOne({
            where: { serviceId }
        })
        if (!service) {
            throw new BadRequestError(ERROR_MESSAGES.SERVICE.SERVICE_NOT_FOUND)
        }
        const { price } = service
        if (Number(balance) < Number(price)) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.NOT_ENOUGH_CREDIT)
        }
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.SERVICE.CAN_NOT_RENT_SERVICE)
    }
}

const createService = async ({ serviceName, price }) => {
    try {
        await db.Services.create({
            serviceName,
            price
        })
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
    canRentService,
    createService,
    getAllServices
}
