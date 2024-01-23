const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Contacts extends Model {
        static associate(models) {
            Contacts.belongsTo(models.Properties, { foreignKey: 'propertyId' })
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
                onDelete: 'SET NULL',
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
