const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class ExpenseTransactions extends Model {
        static associate(models) {
            ExpenseTransactions.belongsTo(models.Users, {
                foreignKey: 'userId'
            })
        }
    }
    ExpenseTransactions.init(
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
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'ExpenseTransactions'
        }
    )
    return ExpenseTransactions
}
