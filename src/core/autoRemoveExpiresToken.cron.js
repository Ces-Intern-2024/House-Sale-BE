const cron = require('node-cron')
const { Op } = require('sequelize')
const db = require('../models')

const autoRemoveExpireTokens = cron.schedule('0 0 1 * *', async () => {
    try {
        await db.Tokens.destroy({
            where: {
                refreshTokenExpires: {
                    [Op.lt]: Date.now()
                }
            }
        })
    } catch (err) {
        console.log(`Error deleting expired tokens: ${err}`)
    }
})

module.exports = autoRemoveExpireTokens
