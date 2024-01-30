const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const validate = require('../../middlewares/validate')
const authentication = require('../../middlewares/authentication')
const { userController } = require('../../controllers')
const { userValidation } = require('../../validations')

const router = express.Router()

router.post('/register', validate(userValidation.register), asyncHandler(userController.register))
router.post('/login', validate(userValidation.login), asyncHandler(userController.login))
router.use(authentication)
router.get('/checkAuth', (req, res) => {
    res.send('Check Auth Success!')
})

module.exports = router
