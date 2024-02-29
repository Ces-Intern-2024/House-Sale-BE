const { ERROR_MESSAGES } = require('../core/message.constant')

const handleError = (error, req, res, next) => {
    const statusCode = error.status || 500
    const response = {
        error: {
            status: statusCode,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        }
    }
    return res.status(statusCode).send(response)
}

module.exports = handleError
