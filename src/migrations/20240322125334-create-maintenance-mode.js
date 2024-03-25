/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('MaintenanceModes', {
            id: {
                allowNull: false,
                unique: true,
                defaultValue: 1,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            isMaintenance: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            description: {
                allowNull: true,
                type: Sequelize.STRING
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
        await queryInterface.dropTable('MaintenanceModes')
    }
}
