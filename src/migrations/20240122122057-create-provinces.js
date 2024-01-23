/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Provinces', {
            provinceCode: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            nameEn: {
                type: Sequelize.STRING
            },
            fullNameEn: {
                type: Sequelize.STRING
            },
            codeName: {
                type: Sequelize.STRING
            }
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Provinces')
    }
}
