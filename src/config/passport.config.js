const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const { jwtConfig } = require('./jwt.config')
const { tokenTypes } = require('./tokens.config')
const { AuthFailureError } = require('../core/error.response')
const { userRepo } = require('../models/repo')

const jwtOptions = {
    secretOrKey: jwtConfig.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const jwtVerify = async (jwtPayload, done) => {
    try {
        if (jwtPayload.type !== tokenTypes.ACCESS) {
            throw new AuthFailureError('Invalid token type')
        }
        const user = await userRepo.getUserById(jwtPayload.sub)
        if (!user) {
            return done(null, false)
        }
        done(null, user)
    } catch (error) {
        done(error, false)
    }
}

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify)

module.exports = { jwtStrategy }
