const express = require('express')
const authentication = require('../../middlewares/authentication')
const checkMaintenanceMode = require('../../middlewares/checkMaintenanceMode')

const router = express.Router()

router.use(authentication('Seller'))
router.use(checkMaintenanceMode)
router.use('/deposit', require('./deposit'))
router.use('/rent-service', require('./rentService'))

module.exports = router
