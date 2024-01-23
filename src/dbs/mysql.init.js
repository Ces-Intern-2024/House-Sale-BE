const { Sequelize } = require('sequelize')
const config = require('../config/config')

const env = process.env.NODE_ENV
const db = config[env]

const sequelize = new Sequelize(db.database, db.username, db.password, {
    host: db.host,
    dialect: db.dialect,
    logging: false
})

const connectionDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log(`Connection has been established successfully::: ${env}`)
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

const database = connectionDatabase()

module.exports = database
