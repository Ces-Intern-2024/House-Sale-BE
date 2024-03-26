const { OK } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')
const { maintenanceService } = require('../services')

const getMaintenanceMode = async (req, res) => {
    const maintenanceMode = await maintenanceService.getMaintenanceMode()
    new OK({
        message: SUCCESS_MESSAGES.MAINTENANCE_MODE.GET_MAINTENANCE_MODE,
        metaData: maintenanceMode
    }).send(res)
}

module.exports = {
    getMaintenanceMode
}
