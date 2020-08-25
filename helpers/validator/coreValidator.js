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

const countTotalPrice = () => {
    return async (req,res,next) => {
        const {user} = req
        const {order} = req.body
        let total = 0
        let err = false
        let cartItemsId = []
        for (let i = 0; i < order.length; i++) {
            const element = order[i]
            const item = await user.getCarts({
                where : {
                    [Op.and] : [
                        {id : element.cartId},
                        {orderId : {[Op.is] : null}}
                    ]
                },
            })
            if (!item.length) {
                err = true
                break
            }
            cartItemsId.push(item[0].id)
            total += item[0].fixedPrice * item[0].quantity
        }
        if (err) return response(res,false,null,'Cart id is invalid',400)
        req.body.orderPriceTotal = total
        req.body.cartItemsId = cartItemsId
        next()
    }
}

module.exports = {
    validateProductAddToCart,
    findItemInCartByProductId,
    countTotalPrice
}