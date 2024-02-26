const { adminService } = require('../services')
const { OK } = require('../core/success.response')

const getAllUsers = async (req, res) => {
    const listUsers = await adminService.getAllUsers({ queries: req.query })
    new OK({
        message: 'Get list users success!',
        metaData: listUsers
    }).send(res)
}

module.exports = {
    getAllUsers
}
