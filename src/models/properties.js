const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Properties extends Model {
        static associate(models) {
            Properties.belongsTo(models.Features, { foreignKey: 'featureId', as: 'feature' })
            Properties.belongsTo(models.Categories, { foreignKey: 'categoryId', as: 'category' })
            Properties.belongsTo(models.Locations, { foreignKey: 'locationId', as: 'location' })
            Properties.belongsTo(models.Users, { foreignKey: 'userId', as: 'seller' })
            Properties.hasMany(models.Images, { foreignKey: 'propertyId', as: 'images' })
            Properties.hasOne(models.FavoriteProperties, { foreignKey: 'propertyId' })
            Properties.hasMany(models.Contacts, { foreignKey: 'propertyId' })
        }
    }
    Properties.init(
        {
            propertyId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            userId: {
                type: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'Users',
                        key: 'userId'
                    },
                    allowNull: false,
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                }
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            featureId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Features',
                    key: 'featureId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            },
            categoryId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Categories',
                    key: 'categoryId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            },
            locationId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Locations',
                    key: 'locationId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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
                type: DataTypes.STRING,
                allowNull: false,
                enum: ['Available', 'Unavailable', 'Disabled'],
                defaultValue: 'Available'
            },
            landArea: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true
            },
            areaOfUse: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true
            },
            numberOfBedRoom: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            numberOfToilet: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            numberOfFloor: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            direction: {
                type: DataTypes.STRING,
                allowNull: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: true
            },
            savedRemainingRentalTime: {
                type: DataTypes.BIGINT,
                defaultValue: 0
            },
            remainingTime: {
                type: DataTypes.VIRTUAL,
                get() {
                    if (this.expiresAt) {
                        const now = new Date()
                        const remainingTime = this.expiresAt - now
                        return remainingTime > 0 ? remainingTime : 0
                    }
                    return 0
                }
            }
        },
        {
            sequelize,
            modelName: 'Properties',
            indexes: [
                {
                    unique: true,
                    fields: ['name']
                }
            ]
        }
    )
    return Properties
}
