const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class ConversionRates extends Model {
        static associate(models) {}
    }
    ConversionRates.init(
        {
            conversionRateId: {
                allowNull: false,
                unique: true,
                defaultValue: 1,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            currencyFrom: {
                type: DataTypes.STRING,
                allowNull: false
            },
            currencyTo: {
                type: DataTypes.STRING,
                allowNull: false
            },
            exchangeRate: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'ConversionRates'
        }
    )
    return ConversionRates
}
