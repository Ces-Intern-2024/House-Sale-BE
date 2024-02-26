const express = require('express')
const authentication = require('../../middlewares/authentication')

const router = express.Router()

router.use(authentication('Admin'))
router.use('/manage-user', require('./manageUser'))

module.exports = router
