const express = require('express')
const authentication = require('../../middlewares/authentication')
const checkMaintenanceMode = require('../../middlewares/checkMaintenanceMode')

const router = express.Router()

router.use(authentication('Seller'))
router.use(checkMaintenanceMode)
router.use('/properties', require('./manageProperty'))
router.use('/report', require('./report'))
router.use('/transaction', require('./manageTransaction'))

module.exports = router
