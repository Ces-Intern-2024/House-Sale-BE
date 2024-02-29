const { BadRequestError, NotFoundError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')
const db = require('../models')
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

    return favoritePropertiesRepo.getFavoritesListByUser(userId)
}

/**
 * Add new property to favorites list
 * @param {Object} params
 * @param {id} userId - The if of user
 * @param {id} propertyId - The id of property
 * @returns {Promise<Boolean>}
 */
const updateFavoriteProperty = async ({ userId, propertyId }) => {
    try {
        const user = await userRepo.getUserById(userId)
        if (!user) {
            throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
        }

        const property = await db.Properties.findOne({
            where: { propertyId }
        })
        if (!property) {
            throw new NotFoundError(ERROR_MESSAGES.PROPERTY.NOT_FOUND)
        }

        const [newFavoriteProperty, created] = await db.FavoriteProperties.findOrCreate({
            where: { userId, propertyId }
        })
        if (!created) {
            return db.FavoriteProperties.destroy({ where: { userId, propertyId } })
        }
        if (!newFavoriteProperty) {
            throw new BadRequestError(ERROR_MESSAGES.FAVORITES_LIST.FAILED_TO_ADD_TO_FAVORITES_LIST)
        }
    } catch (error) {
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.FAVORITES_LIST.UPDATE_FAVORITE_PROPERTY)
    }
}

module.exports = {
    getFavoritesList,
    updateFavoriteProperty
}
