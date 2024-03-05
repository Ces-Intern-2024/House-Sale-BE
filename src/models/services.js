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
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        },
        {
            sequelize,
            modelName: 'Services'
        }
    )
    return Services
}
