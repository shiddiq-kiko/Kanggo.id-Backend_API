const router = require('express').Router()
const ProductController = require('../controllers/productController')
const {auth} = require('../middlewares/authentification')

router.get('/product', ProductController.productList)
router.get('/:id/item', ProductController.productById)
router.post('/product', ProductController.add)
router.put('/:id/item', ProductController.update)
router.delete('/:id/item', ProductController.delete)

module.exports = router