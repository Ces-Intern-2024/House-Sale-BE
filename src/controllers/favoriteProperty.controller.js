const { favoritePropertyService } = require('../services')
const { OK } = require('../core/success.response')

const getFavoritesList = async (req, res) => {
    const userId = req.user?.userId
    const favoritesList = await favoritePropertyService.getFavoritesList(userId)
    new OK({
        message: 'Get your favorites list successfully!',
        metaData: favoritesList
    }).send(res)
}

const updateFavoriteProperty = async (req, res) => {
    const userId = req.user?.userId
    const { propertyId } = req.body
    await favoritePropertyService.updateFavoriteProperty({ userId, propertyId })
    new OK({
        message: 'Your favorites list had been updated successfully!'
    }).send(res)
}

module.exports = {
    getFavoritesList,
    updateFavoriteProperty
}
