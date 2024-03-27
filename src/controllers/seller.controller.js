const { sellerService } = require('../services')
const { OK, Created } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

const getTotalCreditsUsedByDate = async (req, res) => {
    const userId = req.user?.userId
    const result = await sellerService.getTotalCreditsUsedByDate({ userId, ...req.query })
    new OK({
        message: SUCCESS_MESSAGES.SELLER.REPORT.TOTAL_CREDITS_USED_BY_DATE,
        metaData: result
    }).send(res)
}

const getTotalCreditsUsedBySeller = async (req, res) => {
    const userId = req.user?.userId
    const totalCredits = await sellerService.getTotalCreditsUsedBySeller(userId)
    new OK({
        message: SUCCESS_MESSAGES.SELLER.REPORT.TOTAL_CREDITS_USED,
        metaData: totalCredits
    }).send(res)
}

const getTotalAmountDepositedByDate = async (req, res) => {
    const userId = req.user?.userId
    const result = await sellerService.getTotalAmountDepositedByDate({ userId, ...req.query })
    new OK({
        message: SUCCESS_MESSAGES.SELLER.REPORT.TOTAL_AMOUNT_DEPOSITED_BY_DATE,
        metaData: result
    }).send(res)
}

const getTotalAmountDepositedBySeller = async (req, res) => {
    const userId = req.user?.userId
    const totalAmount = await sellerService.getTotalAmountDepositedBySeller(userId)
    new OK({
        message: SUCCESS_MESSAGES.SELLER.REPORT.TOTAL_AMOUNT_DEPOSITED,
        metaData: totalAmount
    }).send(res)
}

const countContactsByDate = async (req, res) => {
    const userId = req.user?.userId
    const countList = await sellerService.countContactsByDate({ userId, ...req.query })
    new OK({
        message: SUCCESS_MESSAGES.SELLER.REPORT.COUNT_CONTACTS_BY_DATE,
        metaData: countList
    }).send(res)
}

const countPropertiesCreatedByDate = async (req, res) => {
    const userId = req.user?.userId
    const countList = await sellerService.countPropertiesCreatedByDate({ userId, ...req.query })
    new OK({
        message: SUCCESS_MESSAGES.SELLER.REPORT.COUNT_PROPERTIES_CREATED_BY_DATE,
        metaData: countList
    }).send(res)
}

const countPropertiesByCategory = async (req, res) => {
    const userId = req.user?.userId
    const countList = await sellerService.countPropertiesByCategory(userId)
    new OK({
        message: SUCCESS_MESSAGES.SELLER.REPORT.COUNT_PROPERTIES_BY_CATEGORY,
        metaData: countList
    }).send(res)
}

const countPropertiesByFeature = async (req, res) => {
    const userId = req.user?.userId
    const countList = await sellerService.countPropertiesByFeature(userId)
    new OK({
        message: SUCCESS_MESSAGES.SELLER.REPORT.COUNT_PROPERTIES_BY_FEATURE,
        metaData: countList
    }).send(res)
}

const deleteListProperties = async (req, res) => {
    const userId = req.user?.userId
    const { propertyId } = req.query
    await sellerService.deleteListProperties({ propertyId, userId })
    new OK({
        message: SUCCESS_MESSAGES.SELLER.DELETE_LIST_PROPERTY
    }).send(res)
}

const updatePropertyStatus = async (req, res) => {
    const userId = req.user?.userId
    const { propertyId } = req.params
    const { status, serviceId } = req.body
    await sellerService.updatePropertyStatus({ propertyId, status, userId, serviceId })
    new OK({
        message: SUCCESS_MESSAGES.SELLER.UPDATE_PROPERTY_STATUS
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
    const { option, propertyData } = req.body
    await sellerService.createProperty({ userId, propertyData, option })
    new Created({
        message: SUCCESS_MESSAGES.SELLER.CREATE_NEW_PROPERTY
    }).send(res)
}

const getProperty = async (req, res) => {
    const userId = req.user?.userId
    const { propertyId } = req.params
    const property = await sellerService.getProperty({ propertyId, userId })
    new OK({
        message: SUCCESS_MESSAGES.SELLER.GET_PROPERTY,
        metaData: property
    }).send(res)
}

const getAllProperties = async (req, res) => {
    const userId = req.user?.userId
    const options = req.query
    const properties = await sellerService.getAllProperties({ options, userId })
    new OK({
        message: SUCCESS_MESSAGES.SELLER.GET_ALL_PROPERTIES,
        metaData: properties
    }).send(res)
}

module.exports = {
    getTotalCreditsUsedByDate,
    getTotalCreditsUsedBySeller,
    getTotalAmountDepositedByDate,
    getTotalAmountDepositedBySeller,
    countContactsByDate,
    countPropertiesCreatedByDate,
    countPropertiesByCategory,
    countPropertiesByFeature,
    deleteListProperties,
    updatePropertyStatus,
    updateProperty,
    createNewProperty,
    getProperty,
    getAllProperties
}
