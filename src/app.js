const express = require('express')
require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
const passport = require('passport')
const { jwtStrategy } = require('./config/passport.config')
const handleError = require('./middlewares/handleError')

const app = express()

require('./dbs/mysql.init')

app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
    cors({
        origin: ['http://localhost:3000', 'https://house-sale-three.vercel.app'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        optionsSuccessStatus: 204
    })
)

app.use(passport.initialize())
passport.use('jwt', jwtStrategy)

app.use(require('./routes'))

app.use((_req, _res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use(handleError)

module.exports = app
