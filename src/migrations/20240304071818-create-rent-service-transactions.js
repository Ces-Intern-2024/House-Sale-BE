/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('RentServiceTransactions', {
            transactionId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'userId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            serviceId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Services',
                    key: 'serviceId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            amountInCredits: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            balanceInCredits: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false
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
        await queryInterface.dropTable('RentServiceTransactions')
    }
}
