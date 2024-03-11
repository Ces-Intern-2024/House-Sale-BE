const cron = require('node-cron')
const { Op } = require('sequelize')
const db = require('../models')
const { PROPERTY_STATUS } = require('./data.constant')
const { BadRequestError } = require('./error.response')

const autoUpdatePropertyStatus = cron.schedule('*/15 * * * *', () => {
    db.Properties.update(
        {
            status: PROPERTY_STATUS.UNAVAILABLE,
            savedRemainingRentalTime: 0,
            expiresAt: null
        },
        {
            where: {
                status: PROPERTY_STATUS.AVAILABLE,
                [Op.or]: [
                    {
                        expiresAt: {
                            [Op.lt]: new Date()
                        }
                    },
                    {
                        expiresAt: null
                    }
                ]
            }
        }
    ).catch((err) => {
        throw new BadRequestError(`Error updating property status: ${err}`)
    })
})

module.exports = autoUpdatePropertyStatus
