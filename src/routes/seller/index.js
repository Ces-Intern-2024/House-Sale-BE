const express = require('express')
const authentication = require('../../middlewares/authentication')

const router = express.Router()

router.use(authentication('Seller'))
router.use('/properties', require('./manageProperty'))
router.use('/report', require('./report'))

module.exports = router
