const passport = require('passport')
const { AuthFailureError } = require('../core/error.response')
const { tokenRepo } = require('../models/repo')

const verifyCallback = (req, resolve, reject) => async (err, user) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1]
        if (err || !user || !accessToken || !(await tokenRepo.isValidAccessToken(accessToken, user.userId))) {
            throw new AuthFailureError('Please Authenticate')
        }

        req.user = user
        resolve()
    } catch (error) {
        reject(error)
    }
}

const authentication = async (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next)
    })
        .then(() => {
            next()
        })
        .catch((err) => {
            next(err)
        })
}

module.exports = authentication
