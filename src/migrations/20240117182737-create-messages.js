/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Messages', {
            messageId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            clientName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            clientPhone: {
                type: Sequelize.STRING,
                allowNull: false
            },
            clientEmail: {
                type: Sequelize.STRING,
                allowNull: false
            },
            propertyId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Properties',
                    key: 'propertyId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            messageContent: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            status: {
                type: Sequelize.BOOLEAN,
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
    async down(queryInterface) {
        await queryInterface.dropTable('Messages')
    }
}
