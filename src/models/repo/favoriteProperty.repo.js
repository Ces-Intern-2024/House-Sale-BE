const db = require('..')
const { BadRequestError } = require('../../core/error.response')
const { getScopesArray, userScopes } = require('./property.repo')

const getFavoritesListByUser = async (userId) => {
    try {
        const { rows: favoritesList, count } = await db.FavoriteProperties.findAndCountAll({
            where: { userId },
            include: [
                {
                    model: db.Properties,
                    as: 'propertyInfo',
                    include: getScopesArray(userScopes)
                }
            ],
            distinct: true,
            attributes: []
        })

        const formattedFavoritesList = favoritesList.map((favorite) => favorite.propertyInfo)
        return { count, favoritesList: formattedFavoritesList }
    } catch (error) {
        throw new BadRequestError('Error occurred when get the list of favorite properties of user!')
    }
}

module.exports = {
    getFavoritesListByUser
}
