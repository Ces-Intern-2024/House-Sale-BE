const { TRANSACTION } = require('../core/data.constant')
const { BadRequestError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')
const { userRepo } = require('../models/repo')

const feeToCreateProperty = TRANSACTION.FEE_CREATE_NEW_PROPERTY

const canCreateNewProperty = async (req, res, next) => {
    try {
        const userId = req.user?.userId
        const { balance } = await userRepo.getUserById(userId)
        if (balance < feeToCreateProperty) {
            throw new BadRequestError(ERROR_MESSAGES.TRANSACTION.NOT_ENOUGH_CREDIT)
        }
        req.amount = feeToCreateProperty
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = canCreateNewProperty
