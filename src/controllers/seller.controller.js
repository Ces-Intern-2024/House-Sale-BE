const { sellerService, locationService, propertyService, imageService, transactionService } = require('../services')
const { OK, Created } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')
const { TRANSACTION } = require('../core/data.constant')

const deleteProperty = async (req, res) => {
    const userId = req.user?.userId
    const { propertyId } = req.params
    await sellerService.deleteProperty({ propertyId, userId })
    new OK({
        message: SUCCESS_MESSAGES.SELLER.DELETE_PROPERTY
    }).send(res)
}

const updateProperty = async (req, res) => {
    const userId = req.user?.userId
    const { propertyId } = req.params
    const updatedData = req.body
    if (Object.keys(updatedData).length === 0) {
        new OK({
            message: SUCCESS_MESSAGES.COMMON.NO_DATA_UPDATED
        }).send(res)
    }

    const property = await sellerService.updateProperty({ propertyId, updatedData, userId })
    new OK({
        message: SUCCESS_MESSAGES.SELLER.UPDATE_PROPERTY,
        metaData: property
    }).send(res)
}

const createNewProperty = async (req, res) => {
    const userId = req.user?.userId
    const { provinceCode, districtCode, wardCode, street, address, images, ...propertyOptions } = req.body

    const newLocation = await locationService.createNewLocation({
        provinceCode,
        districtCode,
        wardCode,
        street,
        address
    })

    const newProperty = await propertyService.createNewProperty({
        userId,
        locationId: newLocation.locationId,
        propertyOptions
    })

    await transactionService.expenseUserBalance({
        userId,
        amount: req.amount,
        description: TRANSACTION.EXPENSE_DESC(newProperty.propertyId)
    })

    const newPropertyImages = await imageService.addImagesToProperty({
        propertyId: newProperty.propertyId,
        images
    })

    new Created({
        message: SUCCESS_MESSAGES.SELLER.CREATE_NEW_PROPERTY,
        metaData: { ...newProperty.dataValues, images: newPropertyImages }
    }).send(res)
}

const getProperty = async (req, res) => {
    const sellerId = req.user?.userId
    const { propertyId } = req.params
    const property = await sellerService.getProperty({ propertyId, sellerId })
    new OK({
        message: SUCCESS_MESSAGES.SELLER.GET_PROPERTY,
        metaData: property
    }).send(res)
}

const getAllProperties = async (req, res) => {
    const sellerId = req.user?.userId
    const options = req.query
    const properties = await sellerService.getAllProperties({ options, sellerId })
    new OK({
        message: SUCCESS_MESSAGES.SELLER.GET_ALL_PROPERTIES,
        metaData: properties
    }).send(res)
}

module.exports = {
    deleteProperty,
    updateProperty,
    createNewProperty,
    getProperty,
    getAllProperties
}
