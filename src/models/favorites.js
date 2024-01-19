const { Model } = require('sequelize')

module.exports = (sequelize) => {
    class Favorites extends Model {
        static associate(models) {}
    }
    Favorites.init(
        {},
        {
            sequelize,
            modelName: 'Favorites'
        }
    )
    return Favorites
}
