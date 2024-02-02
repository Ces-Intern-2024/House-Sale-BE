const express = require('express')
const { locationController } = require('../../controllers')
const asyncHandler = require('../../middlewares/asyncHandler')
const validate = require('../../middlewares/validate')
const { locationValidation } = require('../../validations')

const router = express.Router()

router.get('/provinces', asyncHandler(locationController.getAllProvinces))
router.get(
    '/districts',
    validate(locationValidation.getDistricts),
    asyncHandler(locationController.getAllDistrictsByProvinceCode)
)
router.get('/wards', validate(locationValidation.getWards), asyncHandler(locationController.getAllWardsByDistrictCode))

module.exports = router
