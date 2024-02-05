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
                allowNull: false,
                references: {
                    model: 'Wards',
                    key: 'wardCode'
                },
                allowNull: false
            },
            districtCode: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'Districts',
                    key: 'districtCode'
                },
                allowNull: false
            },
            provinceCode: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'Provinces',
                    key: 'provinceCode'
                },
                allowNull: false
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
