const express = require('express')
const { transactionController } = require('../../controllers')
const authentication = require('../../middlewares/authentication')
const asyncHandler = require('../../middlewares/asyncHandler')
const validate = require('../../middlewares/validate')
const { transactionValidation } = require('../../validations')

const router = express.Router()

router.use(authentication('Seller'))
router.get('', asyncHandler(transactionController.getAllTransactions))
router.post('/deposit', validate(transactionValidation.deposit), asyncHandler(transactionController.depositUserBalance))

module.exports = router
