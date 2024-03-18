const { userRepo, favoritePropertiesRepo } = require('../models/repo')

/**
 * Get the list of favorite properties of user
 * @param {id} userId - The id of user
 * @returns {Promise<[Properties]>}
 */
const getFavoritesList = async (userId) => {
    await userRepo.findUserById(userId)
    return favoritePropertiesRepo.getFavoritesList(userId)
}

/**
 * Add new property to favorites list
 * @param {Object} params
 * @param {id} userId - The if of user
 * @param {id} propertyId - The id of property
 * @returns {Promise<Boolean>}
 */
const updateFavoriteProperty = async ({ userId, propertyId }) => {
    await userRepo.findUserById(userId)
    return favoritePropertiesRepo.updateFavoriteProperty({ userId, propertyId })
}

module.exports = {
    getFavoritesList,
    updateFavoriteProperty
}
