const path = require('path')

const envPath = path.join(__dirname, '../../.env')
require('dotenv').config({ path: envPath })

const development = {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOST,
    dialect: 'mysql'
}

const production = {
    username: process.env.PRO_DB_USERNAME,
    password: process.env.PRO_DB_PASSWORD,
    database: process.env.PRO_DB_NAME,
    host: process.env.PRO_DB_HOST,
    dialect: 'mysql'
}

module.exports = {
    development,
    production
}
