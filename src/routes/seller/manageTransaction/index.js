const express = require('express')

const router = express.Router()

router.use('/deposit', require('./deposit'))
router.use('/rent-service', require('./rentService'))

module.exports = router
