const { conversionRateService } = require('../services')
const { OK } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

const getAllConversionRates = async (req, res) => {
    const listConversionRates = await conversionRateService.getAllConversionRates()
    new OK({
        message: SUCCESS_MESSAGES.CONVERSION_RATE.GET_ALL_CONVERSION_RATES,
        metaData: listConversionRates
    }).send(res)
}

module.exports = {
    getAllConversionRates
}
