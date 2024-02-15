const express = require('express')

const router = express.Router()

router.use('/v1/api/contact', require('./contact'))
router.use('/v1/api/seller', require('./seller'))
router.use('/v1/api/location', require('./location'))
router.use('/v1/api/user', require('./user'))
router.use('/v1/api/properties', require('./property'))
router.use('/v1/api/docs', require('./docs'))

module.exports = router
