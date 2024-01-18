const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Images extends Model {
        static associate(models) {
            Images.belongsTo(models.Properties, { foreignKey: 'propertyId' })
        }
    }
    Images.init(
        {
            propertyId: DataTypes.INTEGER,
            url: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Images'
        }
    )
    return Images
}
