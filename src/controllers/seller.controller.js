const { sellerService, locationService, propertyService, imageService } = require('../services')
const { OK, Created } = require('../core/success.response')

const createNewProperty = async (req, res) => {
    const sellerId = req.user?.userId
    const { provinceCode, districtCode, wardCode, street, address, images, ...propertyOptions } = req.body

    const newLocation = await locationService.createNewLocation({
        provinceCode,
        districtCode,
        wardCode,
        street,
        address
    })

    const newProperty = await propertyService.createNewProperty({
        userId: sellerId,
        locationId: newLocation.locationId,
        propertyOptions
    })

    const newPropertyImages = await imageService.addImagesToProperty({
        propertyId: newProperty.propertyId,
        images
    })

    new Created({
        message: 'New property had been created successfully!',
        metaData: { ...newProperty.dataValues, images: newPropertyImages }
    }).send(res)
}

const getProperty = async (req, res) => {
    const sellerId = req.user?.userId
    const { propertyId } = req.params
    const property = await sellerService.getProperty({ propertyId, sellerId })
    new OK({
        message: 'Get property success!',
        metaData: property
    }).send(res)
}

const getAllProperties = async (req, res) => {
    const sellerId = req.user?.userId
    const options = req.query
    const properties = await sellerService.getAllProperties({ options, sellerId })
    new OK({
        message: 'Get list properties success!',
        metaData: properties
    }).send(res)
}

module.exports = {
    createNewProperty,
    getProperty,
    getAllProperties
}
