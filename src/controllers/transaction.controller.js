const { transactionService } = require('../services')
const { OK } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

const getAllRentServiceTransactions = async (req, res) => {
    const userId = req.user?.userId
    const { fromDateRange, toDateRange } = req.query
    const transactions = await transactionService.getAllRentServiceTransactions({ userId, fromDateRange, toDateRange })
    new OK({
        message: SUCCESS_MESSAGES.TRANSACTION.GET_ALL_RENT_SERVICE_TRANSACTIONS,
        metaData: transactions
    }).send(res)
}

const depositCredit = async (req, res) => {
    const userId = req.user?.userId
    const { newDeposit, currentBalance } = await transactionService.depositCredit({
        userId,
        info: req.body
    })
    new OK({
        message: `Your balance has been added ${newDeposit}$ Credit successfully! Your current balance is ${currentBalance}$ Credit!`
    }).send(res)
}

const getAllDepositTransactions = async (req, res) => {
    const userId = req.user?.userId
    const { fromDateRange, toDateRange } = req.query
    const transactions = await transactionService.getAllDepositTransactions({ userId, fromDateRange, toDateRange })
    new OK({
        message: SUCCESS_MESSAGES.TRANSACTION.GET_ALL_DEPOSIT_TRANSACTIONS,
        metaData: transactions
    }).send(res)
}

module.exports = {
    getAllRentServiceTransactions,
    getAllDepositTransactions,
    depositCredit
}
