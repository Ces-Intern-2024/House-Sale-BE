const { Op } = require('sequelize')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const db = require('../models')
const { userRepo } = require('../models/repo')
const { ERROR_MESSAGES } = require('../core/message.constant')
const { TRANSACTION } = require('../core/data.constant')

const getAllTransactions = async ({
    userId,
    fromDateRange = TRANSACTION.DEFAULT_DATE_RANGE.FROM,
    toDateRange = TRANSACTION.DEFAULT_DATE_RANGE.TO
}) => {
    try {
        const user = await userRepo.getUserById(userId)
        if (!user) {
            throw new NotFoundError('User not found')
        }

        const fromDate = new Date(fromDateRange)
        const toDate = new Date(toDateRange)

        if (fromDate > toDate) {
            throw new BadRequestError('Invalid date range')
        }

        const [depositTransactions, expenseTransactions] = await Promise.all([
            db.DepositsTransactions.findAndCountAll({
                where: {
                    userId,
                    createdAt: {
                        [Op.lt]: toDate,
                        [Op.gt]: fromDate
                    }
                }
            }),
            db.ExpenseTransactions.findAndCountAll({
                where: {
                    userId,
                    createdAt: {
                        [Op.lt]: toDate,
                        [Op.gt]: fromDate
                    }
                }
            })
        ])

        return {
            depositTransactions: {
                count: depositTransactions.count,
                transactions: depositTransactions.rows
            },
            expenseTransactions: {
                count: expenseTransactions.count,
                transactions: expenseTransactions.rows
            }
        }
    } catch (error) {
        throw new BadRequestError(error.message || 'Error occurred when get all transactions')
    }
}

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
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.INVALID_AMOUNT)
    }

    const user = await db.Users.findOne({ where: { userId } })
    if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
    }

    const transaction = await db.sequelize.transaction()

    try {
        const newExpenseTransaction = await db.ExpenseTransactions.create(
            { userId, amount, description },
            { transaction }
        )
        if (!newExpenseTransaction) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.INIT_EXPENSE_TRANSACTION)
        }

        const updatedUser = await user.decrement({ balance: amount }, { transaction })
        if (!updatedUser) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.UPDATE_USER_BALANCE)
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

    const user = await db.Users.findOne({ where: { userId } })
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
    getAllTransactions,
    expenseUserBalance,
    depositUserBalance
}
