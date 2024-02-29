const db = require('..')
const { SCOPES } = require('../../core/data.constant')
const { BadRequestError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')
const { getScopesArray } = require('./property.repo')

const getFavoritesListByUser = async (userId) => {
    try {
        const { rows: favoritesList, count } = await db.FavoriteProperties.findAndCountAll({
            where: { userId },
            include: [
                {
                    model: db.Properties,
                    as: 'propertyInfo',
                    include: getScopesArray(SCOPES.PROPERTY.USER_GET)
                }
            ],
            distinct: true,
            attributes: []
        })

        const formattedFavoritesList = favoritesList.map((favorite) => favorite.propertyInfo)
        return { count, favoritesList: formattedFavoritesList }
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.FAVORITES_LIST.GET_FAVORITES_LIST)
    }
}

module.exports = {
    getFavoritesListByUser
}
