const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {
            Users.belongsTo(models.Roles, { foreignKey: 'roleId', as: 'role' })
            Users.hasMany(models.Properties, { foreignKey: 'userId' })
            Users.hasMany(models.Payments, { foreignKey: 'userId' })
            Users.hasMany(models.FavoriteProperties, { foreignKey: 'userId', as: 'favoritesList' })
            Users.belongsTo(models.Wards, { foreignKey: 'wardCode', as: 'ward' })
            Users.belongsTo(models.Districts, { foreignKey: 'districtCode', as: 'district' })
            Users.belongsTo(models.Provinces, { foreignKey: 'provinceCode', as: 'province' })
            Users.hasMany(models.Tokens, { foreignKey: 'userId' })
            Users.hasMany(models.Contacts, { foreignKey: 'sellerId' })
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
                onDelete: 'CASCADE',
                allowNull: false
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
                },
                allowNull: true
            },
            districtCode: {
                type: DataTypes.STRING,
                references: {
                    model: 'Districts',
                    key: 'districtCode'
                },
                allowNull: true
            },
            provinceCode: {
                type: DataTypes.STRING,
                references: {
                    model: 'Provinces',
                    key: 'provinceCode'
                },
                allowNull: true
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
