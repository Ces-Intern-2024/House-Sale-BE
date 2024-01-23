const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Images extends Model {
        static associate(models) {
            Images.belongsTo(models.Properties, { foreignKey: 'propertyId' })
        }
    }
    Images.init(
        {
            propertyId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Properties',
                    key: 'propertyId'
                }
            },
            imageUrl: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Images'
        }
    )
    return Images
}
