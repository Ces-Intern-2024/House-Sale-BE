/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Locations', {
            locationId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            wardCode: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Wards',
                    key: 'wardCode'
                }
            },
            districtCode: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Districts',
                    key: 'districtCode'
                }
            },
            provinceCode: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Provinces',
                    key: 'provinceCode'
                }
            },
            street: {
                type: Sequelize.STRING,
                allowNull: false
            },
            address: {
                type: Sequelize.STRING,
                allowNull: true
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
        await queryInterface.dropTable('Locations')
    }
}
