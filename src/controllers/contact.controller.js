const { contactService } = require('../services')
const { OK } = require('../core/success.response')

const createContact = async (req, res) => {
    const bodyContact = req.body
    const newContact = await contactService.createContact(bodyContact)
    new OK({
        message: 'Create new contact success!',
        metaData: newContact
    }).send(res)
}

module.exports = {
    createContact
}
