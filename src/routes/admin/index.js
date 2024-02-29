const express = require('express')
const authentication = require('../../middlewares/authentication')

const router = express.Router()

router.use(authentication('Admin'))
router.use('/manage-user', require('./manageUser'))
router.use('/manage-property', require('./manageProperty'))

module.exports = router
