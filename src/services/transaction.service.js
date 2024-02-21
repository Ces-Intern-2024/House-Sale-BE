const { BadRequestError, NotFoundError } = require('../core/error.response')
const db = require('../models')
const { userRepo } = require('../models/repo')

/**
 * Create Expense transaction from user balance
 * @param {object} params
 * @param {id} params.userId - the id of user
 * @param {number} params.amount - the amount to expense
 * @param {string} params.description - the description of expense
 * @returns {Promise<Boolean>}
 */
const expenseUserBalance = async ({ userId, amount, description }) => {
    if (amount < 0) {
        throw new BadRequestError('Invalid amount')
    }

    const user = await userRepo.getUserById(userId)
    if (!user) {
        throw new NotFoundError('User not found')
    }

    const transaction = await db.sequelize.transaction()

    try {
        const newExpenseTransaction = await db.ExpenseTransactions.create(
            { userId, amount, description },
            { transaction }
        )
        if (!newExpenseTransaction) {
            throw new BadRequestError('Error occurred when init expense transaction')
        }

        const updatedUser = await user.decrement({ balance: amount }, { transaction })
        if (!updatedUser) {
            throw new BadRequestError('Error occurred when updated your balance')
        }
        await transaction.commit()
        await updatedUser.reload()
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

/**
 * Create Deposit transaction from user balance
 * @param {object} params
 * @param {id} params.userId - the id of user
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

    const transaction = await db.sequelize.transaction()

    try {
        const depositTransaction = await db.DepositsTransactions.create({ userId, amount }, { transaction })
        if (!depositTransaction) {
            throw new BadRequestError('Error occurred when init deposit transaction')
        }

        const updatedUser = await user.increment({ balance: amount }, { transaction })
        if (!updatedUser) {
            throw new BadRequestError('Error occurred when updated your balance')
        }
        await transaction.commit()
        await updatedUser.reload()
        return { newDeposit: amount, currentBalance: updatedUser.balance }
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

module.exports = {
    expenseUserBalance,
    depositUserBalance
}
