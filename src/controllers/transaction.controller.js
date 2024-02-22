const { transactionService } = require('../services')
const { OK } = require('../core/success.response')

const getAllTransactions = async (req, res) => {
    const userId = req.user?.userId
    const { fromDateRange, toDateRange } = req.query
    const transactions = await transactionService.getAllTransactions({ userId, fromDateRange, toDateRange })
    new OK({
        message: 'Get all transactions successfully!',
        metaData: transactions
    }).send(res)
}

const depositUserBalance = async (req, res) => {
    const userId = req.user?.userId
    const { amount } = req.body
    const { newDeposit, currentBalance } = await transactionService.depositUserBalance({ userId, amount })
    new OK({
        message: `Your balance has been added ${newDeposit}$ successfully! Your current balance is ${currentBalance}$`
    }).send(res)
}

module.exports = {
    getAllTransactions,
    depositUserBalance
}
