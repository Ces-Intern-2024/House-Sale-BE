const express = require('express')
const authentication = require('../../middlewares/authentication')

const router = express.Router()

router.use(authentication('Seller'))
router.use('/deposit', require('./deposit'))
router.use('/rent-service', require('./rentService'))

module.exports = router
