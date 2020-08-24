const {response} = require('../wrapper')
const Op = require('sequelize').Op

// model
const Customer = require('../../models/customer')
const Product = require('../../models/product')
const Cart = require('../../models/cart')

// validasi apakah product ada dan set ke req.body.product
const validateProductAddToCart = () => {
    return async (req,res,next) => {
        const {productId} = req.body
        const product = await Product.findByPk(productId)
        if (!product) return response(res,false,null,'Product not found',400)
        req.body.product = product
        next()
    }
}

// mencari apakah ada cart dengan product yang sama
const findItemInCartByProductId = () => {
    return async (req,res,next) => {
        const {productId} = req.body
        const {user} = req
        const cart = await user.getCarts({
            where : {
                [Op.and] : [
                    {orderId : {[Op.is] : null}},
                    {productId}
                ]
            }
        })
        if (cart) req.body.cart = cart
        next()  
    }
}

module.exports = {
    validateProductAddToCart,
    findItemInCartByProductId
}