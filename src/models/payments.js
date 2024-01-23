const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Payments extends Model {
        static associate(models) {
            Payments.belongsTo(models.Users, { foreignKey: 'userId' })
        }
    }
    Payments.init(
        {
            paymentId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users',
                    key: 'userId'
                }
            },
            amount: {
                type: DataTypes.DECIMAL,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Payments'
        }
    )
    return Payments
}
