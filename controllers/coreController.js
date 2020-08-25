const {response,customError} = require('../helpers/wrapper')
const Op = require('sequelize').Op

// model
const Customer = require('../models/customer')
const Cart = require('../models/cart')
const Product = require('../models/product')
const ProductPhoto = require('../models/productPhoto')
const PaymentMethod = require('../models/payment/paymentMethod')
const Order = require('../models/order')
const Transaction = require('../models/payment/transaction')
const Courier = require('../models/courier')
const OrderAddress = require('../models/address/orderAddress')
const OrderStatus = require('../models/orderStatus')

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

const getPaymentMethod = async (req,res,next) => {
    const payment = await PaymentMethod.findAll({})
    response(res,true,payment,'Success get all payment method',200)
}

// order status belum
const confirmOrder = async (req,res,next) => {
    const tanggal = Date.now()
    const {address,cartItemsId,courier,paymentMethod,orderPriceTotal} = req.body
    // create order
    const order = await Order.create({
        orderCode : `ORDR#${tanggal}`,
        orderPriceTotal,
        order_statuses : {statusType : 1},
        courier,
        transaction : {
            transactionCode : `TRSC#${tanggal}`,
            transactionStatus : 'false',
            paymentMethodId : paymentMethod.paymentMethodId
        },
        order_address : address,
        customerId : req.user.id
    },{
        include : [Transaction,Courier,OrderAddress,OrderStatus]
    })
    // update cart items
    const cartUpdate = await Cart.update({
        orderId : order.id
    }, {
        where : {
            id : {
                [Op.in] : cartItemsId
            }
        }
    })
    response(res,true,{order,cartUpdate},'Success',201)
}

module.exports = {
    addItemsToCart,
    updateCartItem,
    getCartItems,
    deleteCartItems,
    deleteAllCartItems,
    getPaymentMethod,
    confirmOrder
}