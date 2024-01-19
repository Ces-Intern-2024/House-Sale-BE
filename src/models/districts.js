const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Districts extends Model {
        static associate(models) {
            Districts.hasMany(models.Properties, { foreignKey: 'districtId' })
        }
    }
    Districts.init(
        {
            districtId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING
            }
        },
        {
            sequelize,
            modelName: 'Districts'
        }
    )
    return Districts
}
