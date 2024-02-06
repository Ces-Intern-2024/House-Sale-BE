const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Contacts extends Model {
        static associate(models) {
            Contacts.belongsTo(models.Properties, { foreignKey: 'propertyId', as: 'property' })
            Contacts.belongsTo(models.Users, { foreignKey: 'sellerId', as: 'seller' })
        }
    }
    Contacts.init(
        {
            contactId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
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
            },
            sellerId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users',
                    key: 'userId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Contacts'
        }
    )
    return Contacts
}
