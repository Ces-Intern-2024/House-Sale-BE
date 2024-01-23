/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            'Properties',
            {
                propertyId: {
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
                    onDelete: 'SET NULL'
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                code: {
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
                locationId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Locations',
                        key: 'locationId'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL'
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
                numberOfFloor: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                direction: {
                    type: Sequelize.STRING,
                    allowNull: true
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
            },
            {
                indexes: [
                    {
                        unique: true,
                        fields: ['name']
                    },
                    {
                        fields: ['locationId']
                    }
                ]
            }
        )
    },
    async down(queryInterface) {
        await queryInterface.dropTable('Properties')
    }
}
