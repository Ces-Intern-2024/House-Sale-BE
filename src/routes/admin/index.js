const express = require('express')
const authentication = require('../../middlewares/authentication')

const router = express.Router()

router.use(authentication('Admin'))
router.use('/manage-category', require('./manageCategory'))
router.use('/manage-user', require('./manageUser'))
router.use('/manage-property', require('./manageProperty'))
router.use('/manage-transaction', require('./manageTransaction'))
router.use('/manage-conversion-rate', require('./manageConversionRate'))
router.use('/manage-service', require('./manageService'))

module.exports = router
