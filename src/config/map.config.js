const NodeGeocoder = require('node-geocoder')

const options = {
    provider: 'google',
    apiKey: process.env.GOOGLE_MAPS_API_KEY
}

const geocoder = NodeGeocoder(options)

module.exports = geocoder
