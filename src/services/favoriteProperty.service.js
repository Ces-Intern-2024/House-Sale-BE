const { BadRequestError, NotFoundError } = require('../core/error.response')
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
        throw new NotFoundError('User not found')
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
    const user = await userRepo.getUserById(userId)
    if (!user) {
        throw new NotFoundError('User not found')
    }

    const property = await db.Properties.findOne({
        where: { propertyId }
    })
    if (!property) {
        throw new NotFoundError('This property is not available now. Please try another property!')
    }

    const [newFavoriteProperty, created] = await db.FavoriteProperties.findOrCreate({
        where: { userId, propertyId }
    })
    if (!created) {
        return db.FavoriteProperties.destroy({ where: { userId, propertyId } })
    }
    if (!newFavoriteProperty) {
        throw new BadRequestError('Error occurred when add new property to your favorites list!')
    }
}

module.exports = {
    getFavoritesList,
    updateFavoriteProperty
}
