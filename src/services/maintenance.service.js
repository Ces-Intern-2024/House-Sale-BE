const { maintenanceModeRepo } = require('../models/repo')

/**
 * Get maintenance mode info
 * @returns {Promise<MaintenanceMode>} - the maintenance mode
 */
const getMaintenanceMode = async () => {
    return maintenanceModeRepo.getMaintenanceMode()
}
module.exports = {
    getMaintenanceMode
}
