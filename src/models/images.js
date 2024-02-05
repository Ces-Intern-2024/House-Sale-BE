const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Images extends Model {
        static associate(models) {
            Images.belongsTo(models.Properties, { foreignKey: 'propertyId' })
        }
    }
    Images.init(
        {
            imageId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            propertyId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Properties',
                    key: 'propertyId'
                },
                allowNull: false,
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Images'
        }
    )
    return Images
}
