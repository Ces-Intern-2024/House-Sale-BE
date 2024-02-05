const { BadRequestError } = require('../core/error.response')
const { imageRepo } = require('../models/repo')

/**
 * Add property's images to the database
 * @param {Object} params
 * @param {Object} params.propertyId
 * @param {Array<string>} params.images - an array of imageUrl
 * @returns {Promise<Images>}
 */
const addImagesToProperty = async ({ propertyId, images }) => {
    const savedPropertyImages = await imageRepo.savedPropertyImages({ images, propertyId })

    if (!savedPropertyImages) {
        throw new BadRequestError('Error occurred when saving images of new property')
    }

    return savedPropertyImages
}

module.exports = {
    addImagesToProperty
}
