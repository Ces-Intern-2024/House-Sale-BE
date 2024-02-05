const db = require('..')
const { BadRequestError } = require('../../core/error.response')

const savedPropertyImages = async ({ images, propertyId }) => {
    try {
        const imageCreationPromises = images.map(async (imageUrl) => {
            return db.Images.create({
                propertyId,
                imageUrl
            })
        })

        return Promise.all(imageCreationPromises)
    } catch (error) {
        throw new BadRequestError('Error occurred when saving images of new property')
    }
}

module.exports = {
    savedPropertyImages
}
