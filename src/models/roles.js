const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Roles extends Model {
        static associate(models) {
            Roles.hasMany(models.Users, { foreignKey: 'roleId' })
        }
    }
    Roles.init(
        {
            roleId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            roleName: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Roles'
        }
    )
    return Roles
}
