const { transactionRepo } = require('../models/repo')

/**
 * Rent service and update user balance
 * @param {object} params
 * @param {id} params.userId - the id of user
 * @param {id} params.serviceId - the id of service
 * @param {string} params.description - the description of transaction
 * @returns {Promise<Boolean>}
 */
const rentService = async ({ userId, serviceId, description }) => {
    return transactionRepo.rentService({ userId, serviceId, description })
}

/**
 * Get all rent service transactions by admin
 * @param {Object} query - the query from request contains userId, fromDateRange, toDateRange, page, limit, orderBy, sortBy
 * @returns {Promise<RentServiceTransactions>} - the list of rent service transactions
 */
const getAllRentServiceTransactions = async (query) => {
    return transactionRepo.getAllRentServiceTransactions(query)
}

/**
 * Deposit credit to user balance
 * @param {object} params
 * @param {id} params.userId - the id of user
 * @param {Object} params - the info of deposit credit contains amountInDollars, amountInCredits, exchangeRate, description
 * @returns {Promise<Object>}
 */
const depositCredit = async ({ userId, info }) => {
    return transactionRepo.depositCredit({ userId, info })
}

/**
 * Get all deposit transactions
 * @param {Object} query - the query from request contains userId, fromDateRange, toDateRange, page, limit, orderBy, sortBy
 * @returns {Promise<DepositTransactions>} - the list of deposit transactions
 */
const getAllDepositTransactions = async (query) => {
    return transactionRepo.getAllDepositTransactions(query)
}

module.exports = {
    getAllRentServiceTransactions,
    depositCredit,
    getAllDepositTransactions,
    rentService
}
