const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Features extends Model {
        static associate(models) {
            Features.hasMany(models.Properties, { foreignKey: 'featureId' })
        }
    }
    Features.init(
        {
            name: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Features'
        }
    )
    return Features
}
