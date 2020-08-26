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

const confirmOrder = async (req,res,next) => {
    const tanggal = Date.now()
    const {address,cartItemsId,cartItems,courier,paymentMethod,orderPriceTotal} = req.body

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
    await Cart.update({
        orderId : order.id
    }, {
        where : {
            id : {
                [Op.in] : cartItemsId
            }
        }
    })

    // update stock
    for (let i = 0; i < cartItems.length; i++) {
        const cart = cartItems[i]
        const stock = cart.product.productStock
        await cart.product.update({productStock : stock-cart.quantity})
    }

    response(res,true,{order},'Success',201)
}

const cancelOrder = async (req,res,next) => {
    const order = await Order.findOne({
        include : [
            {
                model : OrderStatus,
            },
            {
                model : Cart,
                include : [Product]
            }
        ],
        where : {
            [Op.and] : [
                {id : req.params.orderId},
                {customerId : req.user.id}
            ]
        },
        order : [
            [OrderStatus, 'createdAt', 'DESC']
        ]
    })
    // validation
    if (!order) return next(customError('Order not found',400))
    if (order.order_statuses[0].statusType != 1) return next(customError('Order cannot be canceled',400))

    // adding order statuses
    const status = await OrderStatus.create({statusType : -1, orderId : order.id})

    // update stock
    for (let i = 0; i < order.carts.length; i++) {
        const cartItem = order.carts[i];
        const {product} = cartItem
        const stock = product.productStock
        await product.update({productStock : stock+cartItem.quantity})
    }
    response(res,true,status,'Order canceled',200)

}

module.exports = {
    addItemsToCart,
    updateCartItem,
    getCartItems,
    deleteCartItems,
    deleteAllCartItems,
    getPaymentMethod,
    confirmOrder,
    cancelOrder
}