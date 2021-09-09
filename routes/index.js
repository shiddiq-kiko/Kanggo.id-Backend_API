const router = require('express').Router()
const product = require('./product')
const user = require('./user')
const error = require('../middlewares/errorHandler')

router.use('/products', product)
router.use('/users', user)
router.use(error)

module.exports = router