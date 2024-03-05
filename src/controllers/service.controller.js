const { serviceService } = require('../services')
const { OK, Created } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

const createService = async (req, res) => {
    await serviceService.createService(req.body)
    new Created({
        message: SUCCESS_MESSAGES.SERVICE.CREATE_SERVICE
    }).send(res)
}

const getAllServices = async (req, res) => {
    const listServices = await serviceService.getAllServices()
    new OK({
        message: SUCCESS_MESSAGES.SERVICE.GET_ALL_SERVICES,
        metaData: listServices
    }).send(res)
}

module.exports = {
    createService,
    getAllServices
}
