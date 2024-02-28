const passport = require('passport')
const { AuthFailureError, ForbiddenError } = require('../core/error.response')
const { tokenRepo } = require('../models/repo')
const { rolesConfig, rolesId } = require('../config/roles.config')
const { ERROR_MESSAGES } = require('../core/message.constant')

const verifyCallback = (req, resolve, reject, role) => async (err, user) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1]
        if (err || !user || !accessToken || !(await tokenRepo.isValidAccessToken(accessToken, user.userId))) {
            throw new AuthFailureError(ERROR_MESSAGES.AUTHENTICATION.NOT_AUTHENTICATED)
        }

        if (!user.isActive) {
            throw new ForbiddenError(ERROR_MESSAGES.COMMON.ACCOUNT_NOT_ACTIVE)
        }

        if (role) {
            const hadPermission = rolesConfig[role].includes(user.roleId)
            if (!hadPermission) {
                throw new AuthFailureError(ERROR_MESSAGES.AUTHENTICATION.PERMISSION_DENIED)
            }

            if (user.roleId !== rolesId.User && !user.isEmailVerified) {
                throw new AuthFailureError(ERROR_MESSAGES.COMMON.EMAIL_NOT_VERIFIED)
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
