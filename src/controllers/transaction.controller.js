const { transactionService } = require('../services')
const { OK } = require('../core/success.response')

const depositUserBalance = async (req, res) => {
    const userId = req.user?.userId
    const { amount } = req.body
    const { newDeposit, updatedBalance } = await transactionService.depositUserBalance({ userId, amount })
    new OK({
        message: `Your balance has been added ${newDeposit}$ successfully! Your current balance is ${updatedBalance}$`
    }).send(res)
}

module.exports = {
    depositUserBalance
}
