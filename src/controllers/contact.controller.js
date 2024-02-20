const { contactService, emailService } = require('../services')
const { OK } = require('../core/success.response')

const createContact = async (req, res) => {
    const bodyContact = req.body
    const newContact = await contactService.createContact(bodyContact)
    const newEmail = await emailService.sendContactEmailToSeller(newContact)
    new OK({
        message: 'Create new contact success!',
        metaData: { newContact, newEmail }
    }).send(res)
}

module.exports = {
    createContact
}
