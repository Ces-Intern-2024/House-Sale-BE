const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Categories extends Model {
        static associate(models) {
            Categories.hasMany(models.Properties, { foreignKey: 'categoryId' })
        }
    }
    Categories.init(
        {
            name: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Categories'
        }
    )
    return Categories
}
