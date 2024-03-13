const { serviceRepo } = require('../models/repo')

/**
 * Get all services
 * @returns {Promise<Service>}
 */
const getAllServices = async () => {
    return serviceRepo.getAllServices()
}

module.exports = {
    getAllServices
}
