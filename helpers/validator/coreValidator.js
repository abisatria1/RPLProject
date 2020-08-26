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
        let cartItems = []
        for (let i = 0; i < order.length; i++) {
            const element = order[i]
            const item = await user.getCarts({
                include : [Product],
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
            const cart = item[0]
            const stock = cart.product.productStock
            if (stock < cart.quantity) {
                err = true
                break
            }
            cartItems.push(cart)
            cartItemsId.push(cart.id)
            total += cart.fixedPrice * cart.quantity
        }
        if (err) return response(res,false,null,'Something error',400)
        req.body.orderPriceTotal = total
        req.body.cartItemsId = cartItemsId
        req.body.cartItems = cartItems
        next()
    }
}

module.exports = {
    validateProductAddToCart,
    findItemInCartByProductId,
    countTotalPrice
}