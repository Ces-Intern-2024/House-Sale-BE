const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Features extends Model {
        static associate(models) {
            Features.hasMany(models.Properties, { foreignKey: 'featureId' })
        }
    }
    Features.init(
        {
            featureId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING
            }
        },
        {
            sequelize,
            modelName: 'Features'
        }
    )
    return Features
}
