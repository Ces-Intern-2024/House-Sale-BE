/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ConversionRates', {
            conversionRateId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            currencyFrom: {
                type: Sequelize.STRING,
                allowNull: false
            },
            currencyTo: {
                type: Sequelize.STRING,
                allowNull: false
            },
            exchangeRate: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            effectiveDate: {
                type: Sequelize.DATE,
                allowNull: false
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            createdAt: {
                allowNull: false,
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ConversionRates')
    }
}
