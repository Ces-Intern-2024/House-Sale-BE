const express = require('express')
const { transactionController } = require('../../../controllers')
const asyncHandler = require('../../../middlewares/asyncHandler')
const validate = require('../../../middlewares/validate')
const { transactionValidation } = require('../../../validations')

const router = express.Router()

router.get(
    '',
    validate(transactionValidation.getAllRentServiceTransactions),
    asyncHandler(transactionController.getAllRentServiceTransactions)
)

module.exports = router
