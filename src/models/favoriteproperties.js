const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class FavoriteProperties extends Model {
        static associate(models) {
            FavoriteProperties.belongsTo(models.Properties, { foreignKey: 'propertyId', as: 'propertyInfo' })
            FavoriteProperties.belongsTo(models.Users, { foreignKey: 'userId' })
        }
    }
    FavoriteProperties.init(
        {
            favoriteId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            userId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users',
                    key: 'userId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            },
            propertyId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Properties',
                    key: 'propertyId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'FavoriteProperties'
        }
    )
    return FavoriteProperties
}
