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
                onDelete: 'CASCADE'
            },
            accessToken: {
                type: DataTypes.STRING
            },
            refreshToken: {
                type: DataTypes.STRING
            },
            accessTokenExpires: {
                type: DataTypes.DATE
            },
            refreshTokenExpires: {
                type: DataTypes.DATE
            }
        },
        {
            sequelize,
            modelName: 'Tokens'
        }
    )
    return Tokens
}
