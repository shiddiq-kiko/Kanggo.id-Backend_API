const router = require('express').Router()
const UserController = require('../controllers/UserController')
const {auth} = require('../middlewares/authentification')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.use(auth)
router.get('/', UserController.data)
router.delete('/trxProduct/:order_id/:product_id', UserController.cancelProduct)
router.delete('/trxOrder/:order_id', UserController.cancelTrx)
router.get('/trxOrder', UserController.trxOrder)
router.post('/newOrder', UserController.newTrx)
router.post('/checkout', UserController.checkout)
router.put('/updateTrx', UserController.updateTrx)

module.exports = router