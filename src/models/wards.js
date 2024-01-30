const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Wards extends Model {
        static associate(models) {
            Wards.belongsTo(models.Districts, { foreignKey: 'districtCode' })
            Wards.hasMany(models.Locations, { foreignKey: 'wardCode' })
            Wards.hasMany(models.Users, { foreignKey: 'wardCode' })
        }
    }
    Wards.init(
        {
            wardCode: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            nameEn: DataTypes.STRING,
            fullNameEn: DataTypes.STRING,
            codeName: DataTypes.STRING,
            districtCode: {
                type: DataTypes.STRING,
                references: {
                    model: 'Districts',
                    key: 'districtCode'
                }
            }
        },
        {
            sequelize,
            modelName: 'Wards',
            timestamps: false
        }
    )
    return Wards
}
