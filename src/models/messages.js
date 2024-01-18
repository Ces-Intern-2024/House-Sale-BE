const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Messages extends Model {
        static associate(models) {
            Messages.belongsTo(models.Properties, { foreignKey: 'propertyId' })
        }
    }
    Messages.init(
        {
            messageId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            clientName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            clientPhone: {
                type: DataTypes.STRING,
                allowNull: false
            },
            clientEmail: {
                type: DataTypes.STRING,
                allowNull: false
            },
            propertyId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            messageContent: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            sequelize,
            modelName: 'Messages'
        }
    )
    return Messages
}
