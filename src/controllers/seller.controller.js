const { sellerService } = require('../services')
const { OK, Created } = require('../core/success.response')
const { SUCCESS_MESSAGES } = require('../core/message.constant')

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
