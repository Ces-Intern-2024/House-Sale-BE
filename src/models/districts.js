const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Districts extends Model {
        static associate(models) {
            Districts.belongsTo(models.Provinces, {
                foreignKey: 'provinceCode'
            })
            Districts.hasMany(models.Wards, { foreignKey: 'wardCode' })
            Districts.hasMany(models.Locations, { foreignKey: 'districtCode' })
            Districts.hasMany(models.Users, { foreignKey: 'districtCode' })
        }
    }
    Districts.init(
        {
            districtCode: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            nameEn: DataTypes.STRING,
            fullNameEn: DataTypes.STRING,
            codeName: DataTypes.STRING,
            provinceCode: {
                type: DataTypes.STRING,
                references: {
                    model: 'Provinces',
                    key: 'provinceCode'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            }
        },
        {
            sequelize,
            modelName: 'Districts',
            timestamps: false
        }
    )
    return Districts
}
