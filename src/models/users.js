const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {
            Users.belongsTo(models.Roles, { foreignKey: 'roleId' })
            Users.belongsToMany(models.Properties, { through: 'FavoriteProperties' })
            Users.hasMany(models.Payments, { foreignKey: 'userId' })
            Users.hasMany(models.Properties, { foreignKey: 'userId' })
        }
    }
    Users.init(
        {
            userId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            roleId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Roles',
                    key: 'roleId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Users'
        }
    )
    return Users
}
