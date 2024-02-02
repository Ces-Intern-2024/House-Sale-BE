const passport = require('passport')
const { AuthFailureError } = require('../core/error.response')
const { tokenRepo } = require('../models/repo')
const rolesConfig = require('../config/roles.config')

const verifyCallback = (req, resolve, reject, role) => async (err, user) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1]
        if (err || !user || !accessToken || !(await tokenRepo.isValidAccessToken(accessToken, user.userId))) {
            throw new AuthFailureError('Please Authenticate')
        }

        if (role) {
            const hadPermission = rolesConfig[role].includes(user.roleId)
            if (!hadPermission) {
                throw new AuthFailureError('Permission denied!')
            }
        }

        req.user = user
        resolve()
    } catch (error) {
        reject(error)
    }
}

const authentication = (role) => async (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, role))(req, res, next)
    })
        .then(() => {
            next()
        })
        .catch((err) => {
            next(err)
        })
}

module.exports = authentication
