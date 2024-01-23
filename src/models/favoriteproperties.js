const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class FavoriteProperties extends Model {
        static associate(models) {}
    }
    FavoriteProperties.init(
        {
            favoriteId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            }
        },
        {
            sequelize,
            modelName: 'FavoriteProperties'
        }
    )
    return FavoriteProperties
}
