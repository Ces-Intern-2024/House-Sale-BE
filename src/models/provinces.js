const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Provinces extends Model {
        static associate(models) {
            Provinces.hasMany(models.Districts, { foreignKey: 'provinceCode' })
            Provinces.hasMany(models.Locations, { foreignKey: 'provinceCode' })
        }
    }
    Provinces.init(
        {
            provinceCode: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            nameEn: DataTypes.STRING,
            fullNameEn: DataTypes.STRING,
            codeName: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Provinces'
        }
    )
    return Provinces
}
