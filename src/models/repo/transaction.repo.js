const { Op } = require('sequelize')
const moment = require('moment-timezone')
const db = require('..')
const { TRANSACTION, PAGINATION_DEFAULT, EPSILON } = require('../../core/data.constant')
const { NotFoundError, BadRequestError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')
const { paginatedData, setStartAndEndDates, createDateRange } = require('../../utils')
const { getCurrentExchangeRate } = require('./conversionRate.repo')
const { getUserById } = require('./user.repo')

/**
 * Get deposited data by date range
 * @param {Object} params
 * @param {id} params.userId
 * @param {string} params.fromDateRange - the start date of date range
 * @param {string} params.toDateRange - the end date of date range
 * @returns {Promise<Array.<{date: string, amountInDollars: number, amountInCredits: number}>>}
 */
const getDepositedDataByDateRange = async ({ userId, fromDateRange, toDateRange }) => {
    try {
        const { fromDate, toDate } = setStartAndEndDates(fromDateRange, toDateRange)
        if (fromDate > toDate) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.INVALID_DATE_RANGE)
        }

        const creditDataByDate = await db.DepositsTransactions.findAll({
            attributes: [
                [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
                [db.sequelize.fn('SUM', db.sequelize.col('amountInDollars')), 'amountInDollars'],
                [db.sequelize.fn('SUM', db.sequelize.col('amountInCredits')), 'amountInCredits']
            ],
            where: {
                ...(userId ? { userId } : {}),
                createdAt: {
                    [Op.between]: [fromDate, toDate]
                }
            },
            group: [db.sequelize.fn('DATE', db.sequelize.col('createdAt'))],
            raw: true
        })

        return creditDataByDate
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.GET_DEPOSITED_DATA_BY_DATE_RANGE)
    }
}

/**
 * Calculate daily amounts and total amount deposited
 * @param {Array.<string>} dateRange
 * @param {Array.<{date: string, amountInDollars: number, amountInCredits: number}>} dataByDate
 * @returns {totalAmountInDollars: number, totalAmountInCredits: number, dailyAmounts: Map.<date:string, {amountInDollars: number, amountInCredits: number}>}
 */
const calculateDailyAmountsAndTotalAmountDeposited = (dateRange, dataByDate) => {
    let totalAmountInCredits = 0
    let totalAmountInDollars = 0
    const dailyAmounts = new Map(
        dateRange.map((date) => [moment(date).format('YYYY-MM-DD'), { amountInCredits: 0, amountInDollars: 0 }])
    )
    dataByDate.forEach((item) => {
        if (item.date) {
            dailyAmounts.set(item.date, {
                amountInCredits: item.amountInCredits,
                amountInDollars: item.amountInDollars
            })
            totalAmountInDollars += Number(item.amountInDollars)
            totalAmountInCredits += Number(item.amountInCredits)
        }
    })
    return { totalAmountInDollars, totalAmountInCredits, dailyAmounts }
}

/**
 * Count amount deposited in each type by date in credits and dollars and total amount deposited in each type
 * @param {Object} params
 * @param {id} params.userId
 * @param {string} params.fromDateRange
 * @param {string} params.toDateRange
 * @returns {Promise<{totalAmountInDollars: number, totalAmountInCredits: number, data: Array.<{dateReport: string, amountInDollars: number, amountInCredits: number}>}>}
 */
const getTotalAmountDepositedByDate = async ({ userId, fromDateRange, toDateRange }) => {
    try {
        const depositedDataByDate = await getDepositedDataByDateRange({ userId, fromDateRange, toDateRange })
        const dateRangeArray = createDateRange(fromDateRange, toDateRange)
        const { totalAmountInDollars, totalAmountInCredits, dailyAmounts } =
            calculateDailyAmountsAndTotalAmountDeposited(dateRangeArray, depositedDataByDate)
        const creditsDepositedByDate = Array.from(dailyAmounts).map(([dateReport, amounts]) => ({
            dateReport,
            ...amounts
        }))

        return { totalAmountInDollars, totalAmountInCredits, data: creditsDepositedByDate }
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.GET_TOTAL_AMOUNT_DEPOSITED_BY_DATE)
    }
}

/**
 * Get total amount deposited in dollars
 * @param {id} userId
 * @returns {Promise<number>} - the total amount deposited in dol lars
 */
const getTotalAmountDepositedInDollars = async (userId) => {
    const condition = userId ? { userId } : {}
    try {
        const totalAmountInDollars = await db.DepositsTransactions.sum('amountInDollars', { where: condition })
        return totalAmountInDollars
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.GET_TOTAL_AMOUNT_DEPOSITED_IN_DOLLARS)
    }
}

/**
 * Get total amount deposited in credits
 * @param {id} userId
 * @returns {Promise<number>} - the total amount deposited in credits
 */
const getTotalAmountDepositedInCredits = async (userId) => {
    const condition = userId ? { userId } : {}
    try {
        const totalAmountInCredits = await db.DepositsTransactions.sum('amountInCredits', { where: condition })
        return totalAmountInCredits
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.GET_TOTAL_AMOUNT_DEPOSITED_IN_CREDITS)
    }
}

/**
 * Get total amount deposited in credits and dollars
 * @param {id} userId
 * @returns {Promise<{totalAmountInDollars: number,amountInCredits: number }>}
 */
const getTotalAmountDeposited = async (userId) => {
    try {
        const [totalAmountInDollars, totalAmountInCredits] = await Promise.all([
            getTotalAmountDepositedInDollars(userId),
            getTotalAmountDepositedInCredits(userId)
        ])
        return { totalAmountInDollars, totalAmountInCredits }
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.GET_TOTAL_AMOUNT_DEPOSITED)
    }
}

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
    if (Number(balance) < Number(price)) {
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.NOT_ENOUGH_CREDIT)
    }

    const transaction = await db.sequelize.transaction()

    try {
        const newRentServiceTransaction = await db.RentServiceTransactions.create(
            {
                userId,
                amountInCredits: price,
                balanceInCredits: Number(balance) - Number(price),
                serviceId,
                description
            },
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
 * @param {Object} query - the query from request contains userId, fromDateRange, toDateRange, page, limit, orderBy, sortBy
 * @returns {Promise<RentServiceTransaction[]>} - the list of rent service transactions
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

        const { fromDate, toDate } = setStartAndEndDates(fromDateRange, toDateRange)
        if (fromDate > toDate) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.INVALID_DATE_RANGE)
        }

        const transactionsData = await db.RentServiceTransactions.findAndCountAll({
            where: {
                ...(userId && { userId }),
                createdAt: {
                    [Op.lte]: toDate,
                    [Op.gte]: fromDate
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
 * Validate exchange rate
 * @param {number} exchangeRate  - the exchange rate from request
 * @param {number} currentExchangeRate - the current exchange rate
 * @throws {BadRequestError} - if exchange rate is invalid
 */
const validateExchangeRate = (exchangeRate, currentExchangeRate) => {
    if (Math.abs(exchangeRate - currentExchangeRate) > EPSILON) {
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.INVALID_EXCHANGE_RATE)
    }

    return true
}

/**
 * Validate deposit transaction info
 * @param {number} amountInDollars - the amount in dollars
 * @param {number} amountInCredits - the amount in credits
 * @param {number} exchangeRate - the exchange rate
 */
const validateDepositTransactionInfo = async (amountInDollars, amountInCredits, exchangeRate) => {
    const currentExchangeRate = await getCurrentExchangeRate()
    if (
        amountInDollars <= 0 ||
        amountInCredits <= 0 ||
        exchangeRate <= 0 ||
        !validateExchangeRate(exchangeRate, currentExchangeRate) ||
        Math.abs(amountInDollars - amountInCredits * exchangeRate) > EPSILON
    ) {
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.INVALID_DEPOSIT_AMOUNT)
    }

    return true
}

/**
 * Deposit credit to user balance
 * @param {object} params
 * @param {id} params.userId - the id of user
 * @param {Object} params - the info of deposit credit contains amount and description
 * @returns {Promise<Object>}
 */
const depositCredit = async ({ userId, info }) => {
    const user = await getUserById(userId)
    if (!user) {
        throw new BadRequestError(ERROR_MESSAGES.COMMON.USER_NOT_FOUND)
    }
    const {
        amountInDollars: rawAmountInDollars,
        amountInCredits: rawAmountInCredits,
        exchangeRate: rawExchangeRate,
        description
    } = info
    const amountInDollars = Number(rawAmountInDollars)
    const amountInCredits = Number(rawAmountInCredits)
    const exchangeRate = Number(rawExchangeRate)
    await validateDepositTransactionInfo(amountInDollars, amountInCredits, exchangeRate)
    const { balance } = user
    const balanceAfterDeposit = Number(balance) + Number(amountInCredits)
    const transaction = await db.sequelize.transaction()

    try {
        const depositTransaction = await db.DepositsTransactions.create(
            {
                userId,
                amountInDollars,
                amountInCredits,
                exchangeRate,
                balanceInCredits: balanceAfterDeposit,
                description
            },
            { transaction }
        )
        if (!depositTransaction) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.FAILED_TO_CREATE_DEPOSIT_TRANSACTION)
        }

        const [updated] = await db.Users.update({ balance: balanceAfterDeposit }, { where: { userId }, transaction })
        if (!updated) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.FAILED_TO_UPDATE_USER_BALANCE)
        }
        await transaction.commit()
        return { newDeposit: amountInCredits, currentBalance: balanceAfterDeposit }
    } catch (error) {
        await transaction.rollback()
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.FAILED_TO_DEPOSIT_CREDIT)
    }
}

/**
 * Get all deposit transactions
 * @param {Object} query - the query from request contains userId, fromDateRange, toDateRange, page, limit, orderBy, sortBy
 * @returns {Promise<DepositTransaction[]>} - the list of deposit transactions
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

        const { fromDate, toDate } = setStartAndEndDates(fromDateRange, toDateRange)
        if (fromDate > toDate) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.INVALID_DATE_RANGE)
        }

        const transactionsData = await db.DepositsTransactions.findAndCountAll({
            where: {
                ...(userId && { userId }),
                createdAt: {
                    [Op.lte]: toDate,
                    [Op.gte]: fromDate
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

const checkBalance = (balance, price) => {
    if (Number(balance) < Number(price)) {
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.NOT_ENOUGH_CREDIT)
    }
}

const createRentServiceTransactionAndUpdateUserBalance = async (
    { userId, amount, balance, serviceId, description },
    transaction
) => {
    const newRentServiceTransaction = await db.RentServiceTransactions.create(
        {
            userId,
            amountInCredits: Number(amount),
            balanceInCredits: Number(balance) - Number(amount),
            serviceId,
            description
        },
        { transaction }
    )
    if (!newRentServiceTransaction) {
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.FAILED_TO_CREATE_RENT_SERVICE_TRANSACTION)
    }

    const [updatedUser] = await db.Users.update(
        { balance: Number(balance) - Number(amount) },
        { where: { userId }, transaction }
    )
    if (!updatedUser) {
        throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.FAILED_TO_UPDATE_USER_BALANCE)
    }
}

module.exports = {
    getTotalAmountDepositedByDate,
    getTotalAmountDepositedInDollars,
    getTotalAmountDepositedInCredits,
    getTotalAmountDeposited,
    checkBalance,
    createRentServiceTransactionAndUpdateUserBalance,
    rentService,
    getAllRentServiceTransactions,
    depositCredit,
    getAllDepositTransactions
}
