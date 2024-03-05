const { BadRequestError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')
const db = require('../models')

/**
 * Create new conversion rate
 * @param {Object} conversionRateBody
 * @returns {Promise<boolean>}
 */
const createConversionRate = async (conversionRateBody) => {
    try {
        await db.ConversionRates.create(conversionRateBody)
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.CONVERSION_RATE.CREATE_CONVERSION_RATE)
    }
}

/**
 * Get all services
 * @returns {Promise<ConversionRate[]>}
 */
const getAllConversionRates = async () => {
    try {
        return db.ConversionRates.findAll()
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.CONVERSION_RATE.GET_ALL_CONVERSION_RATES)
    }
}

module.exports = {
    createConversionRate,
    getAllConversionRates
}
