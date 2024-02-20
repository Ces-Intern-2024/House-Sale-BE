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
            amount: {
                type: DataTypes.DECIMAL(10, 2),
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
