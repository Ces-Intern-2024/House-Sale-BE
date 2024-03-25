const { MaintenanceModeError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')
const { getMaintenanceMode } = require('../models/repo/maintenanceMode.repo')

const checkMaintenanceMode = async (req, res, next) => {
    try {
        const { isMaintenance } = await getMaintenanceMode()
        if (isMaintenance && req.method !== 'GET') {
            throw new MaintenanceModeError(ERROR_MESSAGES.MAINTENANCE_MODE.NOTICE)
        }
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = checkMaintenanceMode
