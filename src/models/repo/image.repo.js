const db = require('..')
const { BadRequestError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')

const savedPropertyImages = async ({ images, propertyId }, transaction) => {
    const savedImages = await Promise.all(
        images.map((imageUrl) => {
            return db.Images.create({ propertyId, imageUrl }, { transaction })
        })
    )
    if (!savedImages) {
        throw new BadRequestError(ERROR_MESSAGES.IMAGE.SAVING_IMAGE_FAILED)
    }
}

module.exports = {
    savedPropertyImages
}
