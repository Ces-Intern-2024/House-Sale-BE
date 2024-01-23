module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Wards', {
            wardCode: {
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
            districtCode: {
                type: Sequelize.STRING,
                references: {
                    model: 'Districts',
                    key: 'districtCode'
                }
            }
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Wards')
    }
}
