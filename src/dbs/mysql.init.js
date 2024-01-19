const { Sequelize } = require('sequelize')

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_DIALECT } = process.env
const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    logging: false
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
