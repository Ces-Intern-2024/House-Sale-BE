const { BadRequestError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')
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
        throw new BadRequestError(ERROR_MESSAGES.IMAGE.SAVING_IMAGE_FAILED)
    }

    return savedPropertyImages
}

module.exports = {
    addImagesToProperty
}
