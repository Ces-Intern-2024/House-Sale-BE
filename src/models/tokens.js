const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Tokens extends Model {
        static associate(models) {
            Tokens.belongsTo(models.Users, { foreignKey: 'userId' })
        }
    }
    Tokens.init(
        {
            tokenId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            userId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users',
                    key: 'userId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            },
            accessToken: {
                type: DataTypes.STRING,
                allowNull: false
            },
            refreshToken: {
                type: DataTypes.STRING,
                allowNull: false
            },
            accessTokenExpires: {
                type: DataTypes.DATE,
                allowNull: false
            },
            refreshTokenExpires: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Tokens'
        }
    )
    return Tokens
}
