const { Sequelize } = require('sequelize')
const sequelizeConfig = require('../config/sequelize.config')

const env = process.env.NODE_ENV
const db = sequelizeConfig[env]

const sequelize = new Sequelize(db.database, db.username, db.password, {
    host: db.host,
    port: db.port,
    dialect: db.dialect,
    logging: false,
    query: {
        raw: true
    },
    timezone: '+07:00'
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
