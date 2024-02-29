const { favoritePropertyService } = require('../services')
const { OK } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

const getFavoritesList = async (req, res) => {
    const userId = req.user?.userId
    const favoritesList = await favoritePropertyService.getFavoritesList(userId)
    new OK({
        message: SUCCESS_MESSAGES.FAVORITES_LIST.GET_FAVORITES_LIST,
        metaData: favoritesList
    }).send(res)
}

const updateFavoriteProperty = async (req, res) => {
    const userId = req.user?.userId
    const { propertyId } = req.body
    await favoritePropertyService.updateFavoriteProperty({ userId, propertyId })
    new OK({
        message: SUCCESS_MESSAGES.FAVORITES_LIST.UPDATE_FAVORITE_PROPERTY
    }).send(res)
}

module.exports = {
    getFavoritesList,
    updateFavoriteProperty
}
