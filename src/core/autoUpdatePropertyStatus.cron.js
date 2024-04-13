const cron = require('node-cron')
const { Op } = require('sequelize')
const db = require('../models')
const { PROPERTY_STATUS } = require('./data.constant')

const autoUpdatePropertyStatus = cron.schedule('*/1 * * * *', async () => {
    try {
        await db.Properties.update(
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
        )
    } catch (err) {
        console.error(`Error updating property status: ${err}`)
    }
})

module.exports = autoUpdatePropertyStatus
