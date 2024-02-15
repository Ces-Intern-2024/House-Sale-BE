const express = require('express')
const swaggerUi = require('swagger-ui-express')
const fs = require('fs')
const YAML = require('yaml')
const path = require('path')

const file = fs.readFileSync(path.resolve('./src/docs/swagger.yaml'), 'utf8')
const swaggerDocument = YAML.parse(file)
const router = express.Router()
const options = {
    customCss: '.swagger-ui .topbar { display: none }'
}

router.use('/', swaggerUi.serve)
router.get('/', swaggerUi.setup(swaggerDocument, options))

module.exports = router
