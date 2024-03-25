const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class MaintenanceModes extends Model {
        static associate(models) {}
    }
    MaintenanceModes.init(
        {
            id: {
                allowNull: false,
                unique: true,
                defaultValue: 1,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            isMaintenance: {
                allowNull: false,
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            description: {
                allowNull: true,
                type: DataTypes.STRING
            }
        },

        {
            sequelize,
            modelName: 'MaintenanceModes'
        }
    )
    return MaintenanceModes
}
