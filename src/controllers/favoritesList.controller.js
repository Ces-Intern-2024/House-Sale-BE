const { favoritesListService } = require('../services')
const { OK } = require('../core/success.response')

const updateFavoriteProperty = async (req, res) => {
    const userId = req.user?.userId
    const { propertyId } = req.body
    await favoritesListService.updateFavoriteProperty({ userId, propertyId })
    new OK({
        message: 'Your favorites list had been updated successfully!'
    }).send(res)
}

module.exports = {
    updateFavoriteProperty
}
