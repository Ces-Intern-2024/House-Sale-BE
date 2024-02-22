/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            userId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            roleId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Roles',
                    key: 'roleId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            },
            fullName: {
                type: Sequelize.STRING,
                allowNull: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            status: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            avatar: {
                type: Sequelize.STRING,
                allowNull: true
            },
            wardCode: {
                type: Sequelize.STRING,
                references: {
                    model: 'Wards',
                    key: 'wardCode'
                },
                allowNull: true
            },
            districtCode: {
                type: Sequelize.STRING,
                references: {
                    model: 'Districts',
                    key: 'districtCode'
                },
                allowNull: true
            },
            provinceCode: {
                type: Sequelize.STRING,
                references: {
                    model: 'Provinces',
                    key: 'provinceCode'
                },
                allowNull: true
            },
            street: {
                type: Sequelize.STRING,
                allowNull: true
            },
            address: {
                type: Sequelize.STRING,
                allowNull: true
            },
            balance: {
                type: Sequelize.DECIMAL(10, 2),
                defaultValue: 0
            },
            emailVerificationCode: {
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
    async down(queryInterface) {
        await queryInterface.dropTable('Users')
    }
}
