const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class DepositsTransactions extends Model {
        static associate(models) {
            DepositsTransactions.belongsTo(models.Users, {
                foreignKey: 'userId'
            })
        }
    }
    DepositsTransactions.init(
        {
            transactionId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
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
            amountInDollars: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            amountInCredits: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            exchangeRate: {
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
            modelName: 'DepositsTransactions'
        }
    )
    return DepositsTransactions
}
