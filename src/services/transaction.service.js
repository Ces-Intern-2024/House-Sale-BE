const { BadRequestError, NotFoundError } = require('../core/error.response')
const db = require('../models')
const { userRepo } = require('../models/repo')

/**
 * Deposit user balance
 * @param {object} params
 * @param {id} params.userId - the if of user
 * @param {number} params.amount - the amount to deposit
 * @returns {Promise<number>}
 */
const depositUserBalance = async ({ userId, amount }) => {
    if (amount < 0) {
        throw new BadRequestError('Invalid amount')
    }

    const user = await userRepo.getUserById(userId)
    if (!user) {
        throw new NotFoundError('User not found')
    }

    const { amount: newDeposit } = await db.DepositsTransactions.create({ userId, amount })
    if (!newDeposit) {
        throw new BadRequestError('Error occurred when deposit into your balance')
    }

    const { balance: updatedBalance } = await user.increment({ balance: amount })
    if (!updatedBalance) {
        throw new BadRequestError('Error occurred when updated your balance')
    }

    return { newDeposit, updatedBalance }
}

module.exports = {
    depositUserBalance
}
