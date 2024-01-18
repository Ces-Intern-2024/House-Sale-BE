const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('house_sale', 'root', null, {
    host: 'localhost',
    dialect: 'mysql'
})
const connectionDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

const database = connectionDatabase()

module.exports = database
