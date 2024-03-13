const { conversionRateRepo } = require('../models/repo')

/**
 * Update conversion rate
 * @param {id} conversionRateId - conversion rate id
 * @param {id} newExchangeRate - new exchange rate
 * @returns {Promise<boolean>}
 */
const updateConversionRate = async (conversionRateId, newExchangeRate) => {
    return conversionRateRepo.updateConversionRate(conversionRateId, newExchangeRate)
}

/**
 * Create new conversion rate
 * @param {Object} conversionRateBody
 * @returns {Promise<boolean>}
 */
const createConversionRate = async (conversionRateBody) => {
    return conversionRateRepo.createConversionRate(conversionRateBody)
}

/**
 * Get all services
 * @returns {Promise<ConversionRate[]>}
 */
const getAllConversionRates = async () => {
    return conversionRateRepo.getAllConversionRates()
}

module.exports = {
    updateConversionRate,
    createConversionRate,
    getAllConversionRates
}
