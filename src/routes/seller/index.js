const express = require('express')
const authentication = require('../../middlewares/authentication')
const checkMaintenanceMode = require('../../middlewares/checkMaintenanceMode')

const router = express.Router()

router.use(authentication('Seller'))
router.use(checkMaintenanceMode)
router.use('/properties', require('./manageProperty'))
router.use('/report', require('./report'))

module.exports = router
