const { NotFoundError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')
const { userRepo, favoritePropertiesRepo } = require('../models/repo')

/**
 * Get the list of favorite properties of user
 * @param {id} userId - The id of user
 * @returns {Promise<[Properties]>}
 */
const getFavoritesList = async (userId) => {
    const user = await userRepo.getUserById(userId)
    if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
    }

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
    return favoritePropertiesRepo.updateFavoriteProperty({ userId, propertyId })
}

module.exports = {
    getFavoritesList,
    updateFavoriteProperty
}
