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
                    allowNull: false,
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true
                },
                featureId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Features',
                        key: 'featureId'
                    },
                    allowNull: false,
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                categoryId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Categories',
                        key: 'categoryId'
                    },
                    allowNull: false,
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                locationId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Locations',
                        key: 'locationId'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
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
                    type: Sequelize.STRING,
                    allowNull: false,
                    enum: ['Available', 'Unavailable', 'Disabled'],
                    defaultValue: 'Available'
                },
                landArea: {
                    type: Sequelize.DECIMAL(10, 2),
                    allowNull: true
                },
                areaOfUse: {
                    type: Sequelize.DECIMAL(10, 2),
                    allowNull: true
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
                expiresAt: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                savedRemainingRentalTime: {
                    type: Sequelize.BIGINT,
                    defaultValue: 0
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
                    }
                ]
            }
        )
    },
    async down(queryInterface) {
        await queryInterface.dropTable('Properties')
    }
}
