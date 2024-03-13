const { serviceService } = require('../services')
const { OK } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

const getAllServices = async (req, res) => {
    const listServices = await serviceService.getAllServices()
    new OK({
        message: SUCCESS_MESSAGES.SERVICE.GET_ALL_SERVICES,
        metaData: listServices
    }).send(res)
}

module.exports = {
    getAllServices
}
