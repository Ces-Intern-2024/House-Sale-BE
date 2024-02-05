const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Locations extends Model {
        static associate(models) {
            Locations.belongsTo(models.Wards, { foreignKey: 'wardCode', as: 'ward' })
            Locations.belongsTo(models.Districts, { foreignKey: 'districtCode', as: 'district' })
            Locations.belongsTo(models.Provinces, { foreignKey: 'provinceCode', as: 'province' })
            Locations.hasMany(models.Properties, { foreignKey: 'locationId' })
        }
    }
    Locations.init(
        {
            locationId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            wardCode: {
                type: DataTypes.STRING,
                references: {
                    model: 'Wards',
                    key: 'wardCode'
                }
            },
            districtCode: {
                type: DataTypes.STRING,
                references: {
                    model: 'Districts',
                    key: 'districtCode'
                }
            },
            provinceCode: {
                type: DataTypes.STRING,
                references: {
                    model: 'Provinces',
                    key: 'provinceCode'
                }
            },
            street: {
                type: DataTypes.STRING,
                allowNull: false
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Locations'
        }
    )
    return Locations
}
