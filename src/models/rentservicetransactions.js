const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class RentServiceTransactions extends Model {
        static associate(models) {
            RentServiceTransactions.belongsTo(models.Users, { foreignKey: 'userId' })
            RentServiceTransactions.belongsTo(models.Services, { foreignKey: 'serviceId' })
        }
    }
    RentServiceTransactions.init(
        {
            transactionId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'userId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            serviceId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Services',
                    key: 'serviceId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            amountInCredits: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            balanceInCredits: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'RentServiceTransactions'
        }
    )
    return RentServiceTransactions
}
