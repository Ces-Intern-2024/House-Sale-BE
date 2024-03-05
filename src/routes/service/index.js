const express = require('express')
const { serviceController } = require('../../controllers')
const asyncHandler = require('../../middlewares/asyncHandler')
const authentication = require('../../middlewares/authentication')
const validate = require('../../middlewares/validate')
const { serviceValidation } = require('../../validations')

const router = express.Router()

router.get('', asyncHandler(serviceController.getAllServices))
router.use(authentication('Admin'))
router.post('', validate(serviceValidation.createService), asyncHandler(serviceController.createService))

module.exports = router
