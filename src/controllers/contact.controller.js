const { contactService, emailService } = require('../services')
const { OK } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

const createContact = async (req, res) => {
    const bodyContact = req.body
    const newContact = await contactService.createContact(bodyContact)
    await emailService.sendContactEmailToSeller(newContact)
    new OK({
        message: SUCCESS_MESSAGES.CONTACT.CREATE_CONTACT
    }).send(res)
}

module.exports = {
    createContact
}
