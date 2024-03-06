const axios = require('axios')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const { BadRequestError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')
const { GOOGLE_API_URL, ROUNDS_SALT } = require('../core/data.constant')

const verifyGoogleToken = async (accessToken) => {
    try {
        const response = await axios.get(`${GOOGLE_API_URL}/v3/tokeninfo?access_token=${accessToken}`)
        const { aud: clientId } = response.data

        if (clientId !== process.env.FE_GOOGLE_CLIENT_ID) {
            throw new Error(ERROR_MESSAGES.USER.LOGIN_GOOGLE.INVALID_CLIENT_ID)
        }
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.USER.LOGIN_GOOGLE.INVALID_ACCESS_TOKEN)
    }
}

const generateVerifyEmailCode = async (userId) => {
    const uniqueCode = uuidv4() + userId
    const hashVerificationCode = await bcrypt.hash(uniqueCode, ROUNDS_SALT)

    return { uniqueCode, hashVerificationCode }
}

const hashPassword = async (password) => {
    return bcrypt.hash(password, ROUNDS_SALT)
}

const isValidKeyOfModel = async (model, key, errorMessage) => {
    if (!key) {
        return null
    }

    const validEntity = await model.findByPk(key)
    if (!validEntity) {
        throw new BadRequestError(errorMessage)
    }

    return key
}

const paginatedData = ({ data, page, limit }) => {
    const { count: totalItems, rows } = data
    const totalPages = Math.ceil(totalItems / limit)

    return { totalPages, currentPage: Number(page), totalItems, data: rows }
}

const getExistingKeysInObject = (object, keys) => {
    return keys.reduce((newObj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key) && Object.keys(object[key]).length > 0) {
            return { ...newObj, [key]: object[key] }
        }

        return newObj
    }, {})
}

module.exports = {
    verifyGoogleToken,
    generateVerifyEmailCode,
    hashPassword,
    isValidKeyOfModel,
    paginatedData,
    getExistingKeysInObject
}
