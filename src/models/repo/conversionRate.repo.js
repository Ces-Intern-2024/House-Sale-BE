const db = require('..')
const { BadRequestError, NotFoundError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')

const deleteConversionRate = async (conversionRateId) => {
    try {
        const conversionRate = await db.ConversionRates.findOne({ where: { conversionRateId } })
        if (!conversionRate) {
            throw new NotFoundError(ERROR_MESSAGES.CONVERSION_RATE.CONVERSION_RATE_NOT_FOUND)
        }
        await db.ConversionRates.destroy({ where: { conversionRateId } })
    } catch (error) {
        if (error instanceof NotFoundError) throw error
        throw new BadRequestError(ERROR_MESSAGES.CONVERSION_RATE.DELETE_CONVERSION_RATE)
    }
}

const updateConversionRate = async (conversionRateId, newExchangeRate) => {
    try {
        const conversionRate = await db.ConversionRates.findOne({ where: { conversionRateId } })
        if (!conversionRate) {
            throw new NotFoundError(ERROR_MESSAGES.CONVERSION_RATE.CONVERSION_RATE_NOT_FOUND)
        }
        if (Number(conversionRate.exchangeRate) === Number(newExchangeRate)) {
            throw new BadRequestError(ERROR_MESSAGES.CONVERSION_RATE.SAME_EXCHANGE_RATE)
        }

        await db.ConversionRates.update({ exchangeRate: newExchangeRate }, { where: { conversionRateId } })
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof BadRequestError) throw error
        throw new BadRequestError(ERROR_MESSAGES.CONVERSION_RATE.UPDATE_CONVERSION_RATE)
    }
}

const createConversionRate = async (conversionRateBody) => {
    try {
        await db.ConversionRates.create(conversionRateBody)
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.CONVERSION_RATE.CREATE_CONVERSION_RATE)
    }
}

const getAllConversionRates = async () => {
    try {
        return db.ConversionRates.findAll()
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.CONVERSION_RATE.GET_ALL_CONVERSION_RATES)
    }
}

/**
 * Get current exchange rate
 * @returns {Promise<number>} exchange rate
 */
const getCurrentExchangeRate = async () => {
    try {
        const [currentConversionRate] = await getAllConversionRates()
        if (!currentConversionRate) {
            throw new NotFoundError(ERROR_MESSAGES.CONVERSION_RATE.CONVERSION_RATE_NOT_FOUND)
        }
        const { exchangeRate } = currentConversionRate
        if (!exchangeRate) {
            throw new NotFoundError(ERROR_MESSAGES.CONVERSION_RATE.EXCHANGE_RATE_NOT_FOUND)
        }
        return Number(exchangeRate)
    } catch (error) {
        if (error instanceof NotFoundError) throw error
        throw new BadRequestError(ERROR_MESSAGES.CONVERSION_RATE.GET_CURRENT_EXCHANGE_RATE)
    }
}

module.exports = {
    getCurrentExchangeRate,
    deleteConversionRate,
    updateConversionRate,
    createConversionRate,
    getAllConversionRates
}
