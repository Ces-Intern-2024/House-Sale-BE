const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Categories extends Model {
        static associate(models) {
            Categories.hasMany(models.Properties, { foreignKey: 'categoryId' })
        }
    }
    Categories.init(
        {
            categoryId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Categories'
        }
    )
    return Categories
}
