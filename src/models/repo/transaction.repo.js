const { Op } = require('sequelize')
const db = require('..')
const { TRANSACTION, PAGINATION_DEFAULT } = require('../../core/data.constant')
const { NotFoundError, BadRequestError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')
const { validateUserId } = require('./user.repo')
const { paginatedData } = require('../../utils')

/**
 * Rent service and update user balance
 * @param {object} params
 * @param {id} params.userId - the id of user
 * @param {id} params.serviceId - the id of service
 * @param {string} params.description - the description of transaction
 * @returns {Promise<Boolean>}
 */
const rentService = async ({ userId, serviceId, description }) => {
    const user = await db.Users.findOne({ where: { userId } })
    if (!user) {
        throw new BadRequestError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
    }
    const { balance } = user

    const service = await db.Services.findOne({
        where: { serviceId }
    })
    if (!service) {
        throw new BadRequestError(ERROR_MESSAGES.SERVICE.SERVICE_NOT_FOUND)
    }
    const { price } = service
    if (balance < price) {
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.NOT_ENOUGH_CREDIT)
    }

    const transaction = await db.sequelize.transaction()

    try {
        const newRentServiceTransaction = await db.RentServiceTransactions.create(
            { userId, amount: price, balance: Number(balance) - Number(price), serviceId, description },
            { transaction }
        )
        if (!newRentServiceTransaction) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.FAILED_TO_RENT_SERVICE)
        }

        const updatedUser = await user.decrement({ balance: price }, { transaction })
        if (!updatedUser) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.FAILED_TO_UPDATE_USER_BALANCE)
        }
        await transaction.commit()
        await updatedUser.reload()
    } catch (error) {
        await transaction.rollback()
        throw new BadRequestError(ERROR_MESSAGES.SERVICE.CAN_NOT_RENT_SERVICE)
    }
}

/**
 * Get all rent service transactions by admin
 * @param {Object} params
 * @param {Object} query - the query from request contains userId, fromDateRange, toDateRange, page, limit, orderBy, sortBy
 * @returns {Promise<RentServiceTransactions>} - the list of rent service transactions
 */
const getAllRentServiceTransactions = async (query) => {
    try {
        const {
            userId,
            fromDateRange = TRANSACTION.DEFAULT_DATE_RANGE.FROM(),
            toDateRange = TRANSACTION.DEFAULT_DATE_RANGE.TO(),
            page = PAGINATION_DEFAULT.TRANSACTION.PAGE,
            limit = PAGINATION_DEFAULT.TRANSACTION.LIMIT,
            sortBy = PAGINATION_DEFAULT.TRANSACTION.SORT_BY,
            orderBy = PAGINATION_DEFAULT.TRANSACTION.ORDER_BY
        } = query
        if (userId && !(await db.Users.findByPk(userId))) {
            throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
        }

        const fromDate = new Date(fromDateRange)
        const toDate = new Date(toDateRange)
        if (fromDate > toDate) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.INVALID_DATE_RANGE)
        }

        const transactionsData = await db.RentServiceTransactions.findAndCountAll({
            where: {
                ...(userId && { userId }),
                createdAt: {
                    [Op.lt]: toDate,
                    [Op.gt]: fromDate
                }
            },
            distinct: true,
            offset: (Number(page) - 1) * Number(limit),
            limit: Number(limit),
            order: [[orderBy, sortBy]]
        })
        if (!transactionsData) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.GET_ALL_RENT_SERVICE_TRANSACTIONS)
        }

        return paginatedData({ data: transactionsData, page, limit })
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.GET_ALL_RENT_SERVICE_TRANSACTIONS)
    }
}
/**
 * Deposit credit to user balance
 * @param {object} params
 * @param {id} params.userId - the id of user
 * @param {Object} params - the info of deposit credit contains amount and description
 * @returns {Promise<Object>}
 */
const depositCredit = async ({ userId, info }) => {
    validateUserId(userId)
    const user = await db.Users.findOne({ where: { userId } })
    if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
    }
    const { balance } = user

    const { amount, description } = info
    if (amount < 0) {
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.INVALID_AMOUNT)
    }
    if (!description || typeof description !== 'string') {
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.INVALID_DESCRIPTION)
    }

    const transaction = await db.sequelize.transaction()

    try {
        const depositTransaction = await db.DepositsTransactions.create(
            { userId, amount, balance: Number(balance) + Number(amount), description },
            { transaction }
        )
        if (!depositTransaction) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.FAILED_TO_DEPOSIT_CREDIT)
        }

        const updatedUser = await user.increment({ balance: amount }, { transaction })
        if (!updatedUser) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.FAILED_TO_UPDATE_USER_BALANCE)
        }
        await transaction.commit()
        await updatedUser.reload()
        return { newDeposit: amount, currentBalance: updatedUser.balance }
    } catch (error) {
        await transaction.rollback()
        if (error instanceof BadRequestError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.FAILED_TO_DEPOSIT_CREDIT)
    }
}

/**
 * Get all deposit transactions
 * @param {Object} query - the query from request contains userId, fromDateRange, toDateRange, page, limit, orderBy, sortBy
 * @returns {Promise<DepositTransactions>} - the list of deposit transactions
 */
const getAllDepositTransactions = async (query) => {
    try {
        const {
            userId,
            fromDateRange = TRANSACTION.DEFAULT_DATE_RANGE.FROM(),
            toDateRange = TRANSACTION.DEFAULT_DATE_RANGE.TO(),
            page = PAGINATION_DEFAULT.TRANSACTION.PAGE,
            limit = PAGINATION_DEFAULT.TRANSACTION.LIMIT,
            sortBy = PAGINATION_DEFAULT.TRANSACTION.SORT_BY,
            orderBy = PAGINATION_DEFAULT.TRANSACTION.ORDER_BY
        } = query
        if (userId && !(await db.Users.findByPk(userId))) {
            throw new NotFoundError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
        }

        const fromDate = new Date(fromDateRange)
        const toDate = new Date(toDateRange)
        if (fromDate > toDate) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.INVALID_DATE_RANGE)
        }

        const transactionsData = await db.DepositsTransactions.findAndCountAll({
            where: {
                ...(userId && { userId }),
                createdAt: {
                    [Op.lt]: toDate,
                    [Op.gt]: fromDate
                }
            },
            distinct: true,
            offset: (Number(page) - 1) * Number(limit),
            limit: Number(limit),
            order: [[orderBy, sortBy]]
        })
        if (!transactionsData) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.GET_ALL_DEPOSIT_TRANSACTIONS)
        }

        return paginatedData({ data: transactionsData, page, limit })
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof BadRequestError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.GET_ALL_DEPOSIT_TRANSACTIONS)
    }
}

module.exports = {
    rentService,
    getAllRentServiceTransactions,
    depositCredit,
    getAllDepositTransactions
}
