const passport = require('passport')
const { AuthFailureError } = require('../core/error.response')

const verifyCallback = (req, resolve, reject) => (err, user) => {
    if (err || !user) {
        return reject(new AuthFailureError('Please Authenticate'))
    }
    req.user = user
    resolve()
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
