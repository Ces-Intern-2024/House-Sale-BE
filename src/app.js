const express = require('express')

const app = express()

require('./dbs/mysql.init')

module.exports = app
