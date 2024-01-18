const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Properties extends Model {
        static associate(models) {
            Properties.belongsTo(models.Features, { foreignKey: 'featureId' })
            Properties.belongsTo(models.Categories, { foreignKey: 'categoryId' })
            Properties.belongsTo(models.Districts, { foreignKey: 'districtId' })
            Properties.hasMany(models.Images, { foreignKey: 'propertyId' })
            Properties.belongsToMany(models.Users, { through: 'Favorites' })
            Properties.hasMany(models.Messages, {
                foreignKey: 'propertyId'
            })
        }
    }
    Properties.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: false
            },
            featureId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            districtId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            location: {
                type: DataTypes.STRING,
                allowNull: false
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            currencyCode: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            landArea: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true
            },
            areaOfUse: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            numberOfBedRoom: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            numberOfToilet: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            direction: {
                type: DataTypes.STRING,
                allowNull: true
            },
            numberOfFloor: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Properties'
        }
    )
    return Properties
}
