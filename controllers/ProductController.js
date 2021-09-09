const {Product} = require('../models')

class ProductController{
    static add(req, res, next){
        const newProduct = {
            name : req.body.name,
            price : req.body.price,
            stock : req.body.stock
        }
        // console.log(req.body)
        Product.create(newProduct)
            .then(product => {
                if(req.body.categories){
                    
                }
                else res.status(201).json(product)
            })
            .catch(next)
    }
    static productList(req, res, next){
        Product.findAll()
            .then(product => {
                if(product.length){
                    res.status(200).json(product)
                }
                else{
                    const err = {
                        name : 'dataNotFound'
                    }
                    next(err)
                }
            })
            .catch(next)
    }
    static productById(req, res, next){
        const product_id = +req.params.id
        Product.findByPk(product_id)
            .then(product => {
                if(product){
                    res.status(200).json(product)
                }
                else{
                    const err = {
                        name : 'dataNotFound'
                    }
                    next(err)
                }
            })
            .catch(next)
    }
    static update(req, res, next){
        const product_id = +req.params.id
        const updateProduct = {
            name : req.body.name,
            price : req.body.price,
            stock : req.body.stock
        }
        Product.update(updateProduct, {
                where : {
                    product_id
                }
            })
            .then(product => {
                if (product[0] === 0){
                    const err = {
                        name : 'dataNotFound'
                    }
                    next(err)
                }
                else res.status(200).json({product})
            })
            .catch(next)
    }
    static delete(req, res, next){
        const product_id = +req.params.id
        Product.destroy({
                where : {
                    product_id
                }
            })
            .then(product => {
                if (product === 0){
                    const err = {
                        name : 'dataNotFound'
                    }
                    next(err)
                }
                else res.status(200).json({product})
            })
            .catch(next)
    }
}

module.exports = ProductController