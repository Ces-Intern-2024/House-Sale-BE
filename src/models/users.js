const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {
            Users.belongsToMany(models.Properties, { through: 'Favorites' })
        }
    }
    Users.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            isAdmin: DataTypes.BOOLEAN
        },
        {
            sequelize,
            modelName: 'Users'
        }
    )
    return Users
}
