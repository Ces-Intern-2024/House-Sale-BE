const db = require('..')
const { MAINTENANCE_MODE_DESCRIPTION } = require('../../core/data.constant')
const { BadRequestError, NotFoundError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')

/**
 * Get maintenance mode info
 * @returns {Promise<MaintenanceMode>} - the maintenance mode
 */
const getMaintenanceMode = async () => {
    try {
        const [maintenanceMode] = await db.MaintenanceModes.findAll({
            attributes: ['isMaintenance', 'description', 'updatedAt']
        })
        if (!maintenanceMode) {
            throw new NotFoundError(ERROR_MESSAGES.ADMIN.NOT_FOUND_MAINTENANCE_MODE)
        }

        return maintenanceMode
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.ADMIN.GET_MAINTENANCE_MODE)
    }
}
/**
 * Update maintenance mode
 * @param {Object} params
 * @param {boolean} params.isMaintenance - maintenance mode status
 * @param {string} params.description - end time of maintenance mode
 * @returns {Promise<boolean>} - true if maintenance mode is on, false if maintenance mode is off
 */
const updateMaintenanceMode = async ({ isMaintenance, description }) => {
    try {
        const updateData = { isMaintenance }

        if (isMaintenance) {
            if (!description) {
                throw new BadRequestError(ERROR_MESSAGES.ADMIN.UPDATE_MAINTENANCE_MODE.NEED_DESCRIPTION)
            }
            updateData.description = description
        } else {
            updateData.description = MAINTENANCE_MODE_DESCRIPTION.OFF
        }

        const [updated] = await db.MaintenanceModes.update(updateData, { where: { id: 1 } })
        if (!updated) {
            throw new BadRequestError(ERROR_MESSAGES.ADMIN.UPDATE_MAINTENANCE_MODE.UPDATE_FAILED)
        }

        return !!isMaintenance
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.ADMIN.UPDATE_MAINTENANCE_MODE.UPDATE_FAILED)
    }
}

module.exports = {
    updateMaintenanceMode,
    getMaintenanceMode
}
