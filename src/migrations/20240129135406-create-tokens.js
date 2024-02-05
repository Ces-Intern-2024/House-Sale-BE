/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Tokens', {
            tokenId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'userId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            },
            accessToken: {
                type: Sequelize.STRING,
                allowNull: false
            },
            refreshToken: {
                type: Sequelize.STRING,
                allowNull: false
            },
            accessTokenExpires: {
                type: Sequelize.DATE,
                allowNull: false
            },
            refreshTokenExpires: {
                type: Sequelize.DATE,
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
        await queryInterface.dropTable('Tokens')
    }
}
