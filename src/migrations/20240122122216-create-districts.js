/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Districts', {
            districtCode: {
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
            },
            provinceCode: {
                type: Sequelize.STRING,
                references: {
                    model: 'Provinces',
                    key: 'provinceCode'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            }
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Districts')
    }
}
