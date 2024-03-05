const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class ConversionRates extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    ConversionRates.init(
        {
            conversionRateId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
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
            },
            effectiveDate: {
                type: DataTypes.DATE,
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
