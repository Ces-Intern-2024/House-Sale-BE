const handleError = (error, req, res, next) => {
    const statusCode = error.status || 500
    const response = {
        error: {
            status: statusCode,
            message: error.message || 'Internal Server Error'
        }
    }
    return res.status(statusCode).send(response)
}

module.exports = handleError
