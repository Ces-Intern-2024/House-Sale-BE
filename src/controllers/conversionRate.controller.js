const { conversionRateService } = require('../services')
const { OK, Created } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

const createConversionRate = async (req, res) => {
    await conversionRateService.createConversionRate(req.body)
    new Created({
        message: SUCCESS_MESSAGES.CONVERSION_RATE.CREATE_CONVERSION_RATE
    }).send(res)
}

const getAllConversionRates = async (req, res) => {
    const listConversionRates = await conversionRateService.getAllConversionRates()
    new OK({
        message: SUCCESS_MESSAGES.CONVERSION_RATE.GET_ALL_CONVERSION_RATES,
        metaData: listConversionRates
    }).send(res)
}

module.exports = {
    createConversionRate,
    getAllConversionRates
}
