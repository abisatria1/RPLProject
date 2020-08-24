const {response,customError} = require('../helpers/wrapper')
const Op = require('sequelize').Op

// model
const Customer = require('../models/customer')
const Cart = require('../models/cart')
const Product = require('../models/product')
const ProductPhoto = require('../models/productPhoto')

const addItemsToCart = async (req,res,next) => {
    const {product,quantity} = req.body
    let cart = req.body.cart[0]
    const {user} = req
    if (!cart) {
        cart = await Cart.create({
            fixedPrice : product.productPrice,
            quantity : parseInt(quantity),
            productId : product.id,
            customerId : user.id
        })
    }else {
        cart.quantity += parseInt(quantity)
        await cart.save()
    }
    response(res,true,{cart},'Success add items to cart',201)
}

const getCartItems = async (req,res,next) => {
    const {user} = req
    const carts = await user.getCarts({
        attributes : {exclude : ['customerId','deletedAt']},
        include : [{
            model : Product,
            include : [ProductPhoto]
        }],
        where : {orderId : {[Op.is] : null}}
    })
    response(res,true,{carts},'User carts has been fetched',200)
}

const updateCartItem = async (req,res,next) => {
    const {user} = req
    const {quantity} = req.body
    const cart = await user.getCarts({
        where : {
            [Op.and] : [
                {id : req.params.cartId},
                {orderId : {[Op.is] : null}}
            ]
        }
    })
    if (cart.length == 0) return next(customError('Cart item not found',400))
    const update = await cart[0].update({quantity : parseInt(quantity)})
    response(res,true,{cart : update},'Cart item has been updated',200)
}


const deleteCartItems = async (req,res,next) => {
    const {user} = req
    const cart = await user.getCarts({
        where : {
            [Op.and] : [
                {id : req.params.cartId},
                {orderId : {[Op.is] : null}}
            ]
        }
    })
    if (cart.length == 0) return next(customError('Cart item not found',400))
    await cart[0].destroy({force : true})
    response(res,true,{},'Cart items has been deleted',200)
}

const deleteAllCartItems = async (req,res,next) => {
    const {user} = req
    await Cart.destroy({
        where : {
            [Op.and] : [
                {orderId : {[Op.is] : null}},
                {customerId : user.id}
            ]
        },
        force : true
    })
    response(res,true,{},'All cart items has been deleted',200)
}

module.exports = {
    addItemsToCart,
    updateCartItem,
    getCartItems,
    deleteCartItems,
    deleteAllCartItems
}