const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const { userController } = require('../../controllers')
const validate = require('../../middlewares/validate')
const { userValidation } = require('../../validations')

const router = express.Router()

router.post('/register', validate(userValidation.register), asyncHandler(userController.register))

module.exports = router
