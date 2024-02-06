const { BadRequestError } = require('../core/error.response')
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
        where: { propertyId, userId }
    })
    if (!property) {
        throw new BadRequestError('This property is not available now. Please try another property!')
    }

    const newContact = await db.Contacts.create({ ...bodyContact })
    if (!newContact) {
        throw new BadRequestError('Error encountered when create new contact!')
    }

    return newContact
}

module.exports = {
    createContact
}
