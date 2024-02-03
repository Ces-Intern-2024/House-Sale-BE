const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {
            Users.belongsTo(models.Roles, { foreignKey: 'roleId', as: 'role' })
            Users.belongsToMany(models.Properties, { through: 'FavoriteProperties' })
            Users.hasMany(models.Payments, { foreignKey: 'userId' })
            Users.hasMany(models.Properties, { foreignKey: 'userId' })
            Users.belongsTo(models.Wards, { foreignKey: 'wardCode', as: 'ward' })
            Users.belongsTo(models.Districts, { foreignKey: 'districtCode', as: 'district' })
            Users.belongsTo(models.Provinces, { foreignKey: 'provinceCode', as: 'province' })
            Users.hasMany(models.Tokens, { foreignKey: 'userId' })
        }
    }
    Users.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
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
            fullName: {
                type: DataTypes.STRING,
                allowNull: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: true
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
                allowNull: true
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
        },
        {
            sequelize,
            modelName: 'Users'
        }
    )
    return Users
}
