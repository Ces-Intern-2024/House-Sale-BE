const cron = require('node-cron')
const { Op } = require('sequelize')
const db = require('../models')
const { BadRequestError } = require('./error.response')

const autoRemoveExpireTokens = cron.schedule('0 0 1 * *', () => {
    db.Tokens.destroy({
        where: {
            refreshTokenExpires: {
                [Op.lt]: Date.now()
            }
        }
    }).catch((err) => {
        throw new BadRequestError(`Error deleting expired tokens: ${err}`)
    })
})

module.exports = autoRemoveExpireTokens
