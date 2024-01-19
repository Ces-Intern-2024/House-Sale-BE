/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Properties', {
            propertyId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false
            },
            slug: {
                type: Sequelize.STRING,
                allowNull: false
            },
            featureId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Features',
                    key: 'featureId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            categoryId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Categories',
                    key: 'categoryId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            districtId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Districts',
                    key: 'districtId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            imageUrl: {
                type: Sequelize.STRING,
                allowNull: false
            },
            location: {
                type: Sequelize.STRING,
                allowNull: false
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            currencyCode: {
                type: Sequelize.STRING,
                allowNull: false
            },
            status: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            landArea: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true
            },
            areaOfUse: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            numberOfBedRoom: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            numberOfToilet: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            direction: {
                type: Sequelize.STRING,
                allowNull: true
            },
            numberOfFloor: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable('Properties')
    }
}
