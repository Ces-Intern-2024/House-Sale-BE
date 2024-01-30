const bcrypt = require('bcrypt')
const { BadRequestError } = require('../core/error.response')
const { userRepo } = require('../models/repo')
const db = require('../models')
const { generateAuthTokens } = require('./token.service')

/**
 * Create new user
 * @param {Object} userBody - user information
 * @returns {Promise<User, Tokens>} - return new user and tokens
 */
const register = async (userBody) => {
    const { email, password } = userBody
    if (await userRepo.isEmailTaken(email)) {
        throw new BadRequestError('User already exists! Please register with another email.')
    }

    if (!(await userRepo.isValidUserInformation(userBody))) {
        throw new BadRequestError('User information not valid.')
    }

    const roundsSalt = 10
    const hashedPassword = await bcrypt.hash(password, roundsSalt)
    const newUser = await db.Users.create({ ...userBody, password: hashedPassword })
    if (!newUser) {
        throw new BadRequestError('Failed creating new user.')
    }

    const { userId } = newUser
    const tokens = await generateAuthTokens(userId)
    if (!tokens) {
        await db.Users.destroy({ where: { userId } })
        throw new BadRequestError('Failed creating tokens')
    }

    const userInfo = {
        userId: newUser.userId,
        email: newUser.email,
        fullName: newUser.fullName
    }

    return { newUser: userInfo, tokens }
}
module.exports = {
    register
}
