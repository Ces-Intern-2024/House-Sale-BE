const { BadRequestError } = require('../core/error.response')
const { userRepo } = require('../models/repo')

const FEE_CREATE_NEW_PROPERTY = 20

const canCreateNewProperty = async (req, res, next) => {
    try {
        const userId = req.user?.userId
        const { balance } = await userRepo.getUserById(userId)
        if (balance < FEE_CREATE_NEW_PROPERTY) {
            throw new BadRequestError('Your balance is not enough to create new property. Please refill your balance!')
        }
        req.amount = FEE_CREATE_NEW_PROPERTY
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = canCreateNewProperty
