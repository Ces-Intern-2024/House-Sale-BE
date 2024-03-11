const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Services extends Model {
        static associate(models) {
            Services.hasMany(models.RentServiceTransactions, { foreignKey: 'serviceId' })
        }
    }
    Services.init(
        {
            serviceId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            serviceName: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            duration: {
                type: DataTypes.INTEGER,
                enum: [15, 30, 60],
                allowNull: false
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Services'
        }
    )
    return Services
}
