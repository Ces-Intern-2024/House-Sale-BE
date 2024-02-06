const express = require('express')
const { contactController } = require('../../controllers')
const asyncHandler = require('../../middlewares/asyncHandler')
const validate = require('../../middlewares/validate')
const { contactValidation } = require('../../validations')

const router = express.Router()

router.post('', validate(contactValidation.createContact), asyncHandler(contactController.createContact))

module.exports = router
