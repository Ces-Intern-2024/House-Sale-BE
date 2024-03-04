const { PROPERTY_STATUS } = require('../core/data.constant')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')
const db = require('../models')

/**
 * Create new contact and send mail to seller
 * @param {Object} bodyContact
 * @param {id} bodyContact.propertyId
 * @param {id} bodyContact.sellerId
 * @param {string} bodyContact.name
 * @param {string} bodyContact.email
 * @param {string} bodyContact.phone
 * @param {text} bodyContact.message
 * @returns {Promise<Contacts>}
 */
const createContact = async (bodyContact) => {
    const { propertyId, sellerId: userId } = bodyContact
    const property = await db.Properties.findOne({
        where: { propertyId, userId, status: PROPERTY_STATUS.AVAILABLE }
    })
    if (!property) {
        throw new NotFoundError(ERROR_MESSAGES.PROPERTY.NOT_FOUND)
    }

    const newContact = await db.Contacts.create({ ...bodyContact })
    if (!newContact) {
        throw new BadRequestError(ERROR_MESSAGES.CONTACT.FAILED_TO_CREATE_CONTACT)
    }

    return newContact
}

module.exports = {
    createContact
}
