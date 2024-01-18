const { Model } = require('sequelize')

module.exports = (sequelize) => {
    class Favorites extends Model {
        static associate() {}
    }
    Favorites.init(
        {},
        {
            sequelize,
            modelName: 'Favorites'
        }
    )
}
