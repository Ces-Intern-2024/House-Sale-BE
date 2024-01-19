const express = require('express')
require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
const handleError = require('./middlewares/handleError')

const app = express()

require('./dbs/mysql.init')

app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.options('*', cors())

app.use(require('./routes'))

app.use((_req, _res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use(handleError)

module.exports = app
