const {User, TrxOrder, Product, sequelize, TrxProduct} = require('../models')
const {createToken} = require('../helpers/jwt')
const {compareLogin} = require('../helpers/bcrypt')
const promises = []
const updateProduct = []

class UserController {
    static register (req, res, next) {
        let token = ''
        const newUser = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
        }
        User.create(newUser)
            .then(user => {
                const pick = {
                    user_id : user.user_id,
                    email : user.email
                }
                token =  createToken(pick)
            })
            .then(response => {
                res.status(201).json({token})
            })
            .catch(next)
    }
    static login(req, res, next){
        const userLogin = {
            email : req.body.email,
            password : req.body.password
        }
        User.findOne({
                where : {
                    email : userLogin.email
                }
            })
            .then(user => {
                if(user){
                    let compare = compareLogin(userLogin.password, user.password)
                    if(compare){
                        const pick = {
                            user_id : user.user_id,
                            email : user.email
                        }
                        let token =  createToken(pick)
                        res.status(200).json({token})
                    }
                    else {
                        const err = {
                            name: "loginError"

                        }
                        next(err)
                    }
                }
                else{
                    const err = {
                        name: "loginError"
                    }
                    next(err)
                }
            })
            .catch(err => {
                next()
            })
    }
    static data (req, res, next) {
        const id = req.decode.user_id
        User.findOne({
                where: {
                    user_id:id
                },
                include: {
                    model: TrxOrder,
                    include: Product
                }
            })
            .then(user => {
                res.status(200).json(user)
            })
            .catch(next)
    }
    static trxOrder (req, res, next){
        const order_id = req.params.order_id
        TrxOrder.findAll({
            where: {order_id},
            include: [
                {
                    model: TrxProduct
                }
            ]
        })
        .then(orders => {
            res.status(200).json(orders)
        })
        .catch(next)
    }
    static newTrx (req, res, next) {
        const newOrder = {
            user_id : req.decode.user_id,
            status: "pending",
        }
        TrxOrder.create(newOrder)
            .then(el => {
                const putToOrder = {
                    order_id: el.order_id,
                    product_id: req.body.product_id,
                    amount: req.body.amount,
                }
                return TrxProduct.create(putToOrder)
            })
            .then(order => {
                res.status(201).json(order)
            })
            .catch(next)
    }
    static cancelProduct (req, res, next) {
        const order_id = +req.params.order_id
        const product_id = +req.params.product_id
        TrxProduct.destroy({
                where: {
                    order_id,
                    product_id,
                }
            })
            .then(order => {
                return TrxOrder.findOne({
                    where: {
                        order_id
                    },
                    include : Product
                })
            })
            .then(order => {
                console.log("ini",order)
                if(order.Products.length === 0){
                    return TrxOrder.destroy({
                        where: {
                            order_id
                        }
                    })
                } else {
                    res.status(200).json(order)
                }
            })
            .then(el => {
                res.status(200).json(el)
            })
            .catch(next)
    }
    static cancelTrx (req, res, next) {
        const order_id = +req.params.order_id
        TrxOrder.destroy({where: {order_id}})
            .then(el => {
                return TrxProduct.destroy({
                    where: {
                        order_id,
                    }
                })
            })
            .then(order => {
                res.status(200).json(order)
            })
            .catch(next)
    }
    static updateTrx (req, res, next){
        const orders = req.body.orders
        const order_id = req.body.order_id
        for(let trOrder of orders){
            if(trOrder.amount == 0){
                TrxProduct.destroy(
                    {
                        where:  {
                            order_id,
                            product_id: trOrder.product_id
                        }
                    })
                    .then(el => {
                        return TrxOrder.findOne({
                            where: {
                                order_id
                            },
                            include : Product
                        })
                    })
                    .then(order => {
                        if(order.Products.length === 0){
                            return TrxOrder.destroy({
                                where: {
                                    order_id
                                }
                            })
                        } else {
                            res.status(200).json(order)
                        }
                    })
                    .then(el => {
                        res.status(200).json(el)
                    })
                    .catch(next)
            } else {
                TrxProduct.findOne({
                    where: {
                        order_id,
                        product_id: trOrder.product_id
                    }
                })
                .then(elOrder => {
                    if(elOrder){
                        const updateOrder = trOrder
                        console.log(trOrder)
                        return TrxProduct.update(trOrder, {
                            where: {
                                order_id,
                                product_id: trOrder.product_id
                            }
                        })
                    } else {
                        let newOrder = {
                            order_id,
                            product_id: trOrder.product_id,
                            amount: trOrder.amount,
                        }
                        return TrxProduct.create(newOrder)
                    }
                })
                .then(order => {
                    res.status(200).json(order)
                })
                .catch(next)
            }
        }
    }
    static checkout (req, res, next) {
        const orders = req.body.orders
        const order_id = req.body.order_id
        for (let i = 0; i < orders.length; i++) {
            Product.findOne({where : {product_id : orders[i].product_id}})
                .then(product => {
                    if (product.stock - orders[i].amount < 0){
                        const err = {
                            name: 'transactionError',
                            message: 'One of your product is out of stock'
                        }
                        next(err)
                    }
                    else {
                        const newStock = product.stock - orders[i].amount
                        const temp = {
                            product_id: orders[i].product_id,
                            name: product.name,
                            price: product.price,
                            stock: newStock
                        }
                        updateProduct.push(temp)
                        const temp2 = {
                            order_id: orders[i].order_id,
                            product_id: orders[i].product_id,
                            amount: orders[i].amount,
                        }
                        promises.push(temp2)
                        if (i+1 === orders.length) {
                            return TrxOrder.findOne({where: {order_id}})
                                .then(trxOrder => {
                                    let updateTr = {
                                        order_id,
                                        user_id: req.decode.user_id,
                                        status: "paid"
                                    }
                                    return TrxOrder.update(updateTr, {
                                        where :{order_id}
                                    })
                                })
                                .then(order =>{
                                    return UserController.productUpdate(req, res, next)
                                })
                                .catch(next)
                        }
                    }
                })
                .catch(next)
        }
    }
    static productUpdate (req, res, next) {
        const TrxUpdate = promises.map(el => {
            return TrxProduct.update(el, {where: {order_id: el.order_id, product_id: el.product_id}})
        })
        Promise.all(TrxUpdate)
            .then(data => {
                const productUpdate = updateProduct.map(el => {
                    const product = {
                        name: el.name,
                        price: el.price,
                        stock: el.stock
                    }
                    return Product.update(product, {where: {product_id: el.product_id}})
                })
                return Promise.all(productUpdate)
            })
            .then( success => {
                res.status(200).json(success)
            })
            .catch(next)
    }
}

module.exports = UserController