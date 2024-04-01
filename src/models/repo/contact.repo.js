const { Op } = require('sequelize')
const db = require('..')
const { BadRequestError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')
const { setStartAndEndDates, createDateRange, calculateDailyCountsAndTotalCount } = require('../../utils')

/**
 * Get total contacts of seller
 * @param {id} userId
 * @returns {Promise<number>} - Total contacts of seller
 */
const getTotalContactsBySeller = async (userId) => {
    try {
        const totalContacts = await db.Contacts.count({
            where: { sellerId: userId }
        })
        return totalContacts
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.CONTACT.GET_TOTAL_CONTACTS_BY_SELLER)
    }
}

/**
 * Get contact count by date range (only day with at least 1 contact)
 * @param {Objects} params
 * @param {String} params.userId - sellerId
 * @param {String} params.fromDateRange
 * @param {String} params.toDateRange
 * @returns {Promise<[{date: DATE, count: number}]>} contactCountByDate
 */
const getContactCountByDateRange = async ({ userId: sellerId, fromDateRange, toDateRange }) => {
    try {
        const { fromDate, toDate } = setStartAndEndDates(fromDateRange, toDateRange)
        if (fromDate > toDate) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.INVALID_DATE_RANGE)
        }
        const condition = {
            ...(sellerId ? { sellerId } : {}),
            createdAt: {
                [Op.between]: [fromDate, toDate]
            }
        }
        const contactCountByDate = await db.Contacts.findAll({
            attributes: [
                [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
                [db.sequelize.fn('COUNT', db.sequelize.col('sellerId')), 'count']
            ],
            where: condition,
            group: [db.sequelize.fn('DATE', db.sequelize.col('createdAt'))],
            raw: true
        })

        return contactCountByDate
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.CONTACT.GET_CONTACTS_COUNT_BY_DATE_RANGE)
    }
}

/**
 * Get contact count by date range (all days in date range)
 * @param {Object} params
 * @param {String} params.userId
 * @param {String} params.fromDateRange
 * @param {String} params.toDateRange
 * @returns {Promise<{totalCount: number, data:[{dateReport: DATE, count: number}]}>} countContactsByDateData
 */
const countContactsByDate = async ({ userId, fromDateRange, toDateRange }) => {
    try {
        const contactCountByDate = await getContactCountByDateRange({ userId, fromDateRange, toDateRange })
        const dateRangeArray = createDateRange(fromDateRange, toDateRange)
        const { totalCount, dailyCounts } = calculateDailyCountsAndTotalCount(dateRangeArray, contactCountByDate)
        const countContactsByDateData = Array.from(dailyCounts).map(([dateReport, count]) => ({
            dateReport,
            count
        }))

        return { totalCount, data: countContactsByDateData }
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.CONTACT.COUNT_CONTACTS_BY_DATE_RANGE)
    }
}

module.exports = {
    getTotalContactsBySeller,
    countContactsByDate
}
