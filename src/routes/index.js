const express = require('express')

const router = express.Router()

router.use('/v1/api/maintenance-mode', require('./maintenanceMode'))
router.use('/v1/api/conversion-rate', require('./conversionRate'))
router.use('/v1/api/services', require('./service'))
router.use('/v1/api/admin', require('./admin'))
router.use('/v1/api/favorites-list', require('./favoriteProperty'))
router.use('/v1/api/contact', require('./contact'))
router.use('/v1/api/seller', require('./seller'))
router.use('/v1/api/location', require('./location'))
router.use('/v1/api/user', require('./user'))
router.use('/v1/api/properties', require('./property'))
router.use('/v1/api/categories', require('./category'))
router.use('/v1/api/features', require('./feature'))
router.use('/v1/api/docs', require('./docs'))

module.exports = router
