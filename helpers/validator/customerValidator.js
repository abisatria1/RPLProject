const {response} = require('../wrapper')
const {comparePassword} = require('../hash')
const Customer = require('../../models/customer')
const Order = require('../../models/order')
const OrderStatus = require('../../models/orderStatus')
const Transaction = require('../../models/payment/transaction')

const Op = require('sequelize').Op


const validateRePassword  = () => {
    return (req,res,next) => {
        const {password,rePassword} = req.body
        if (password !== rePassword) return response(res,false,null,'Confirm password not valid',400)
        next()
    }
}

const validateEmail = () => {
    return async (req,res,next) => {
        const email = await Customer.findOne({where : {email : req.body.email}})
        if (req.user) {
            if (email.id != req.user.id) return response(res,false,null,'Email has been used',400)
            return response(res,false,null,'New email same with the old email',400)
        }else {
            if (email) return response(res,false,null,'Email has been used',400)
        }
        next()
    }
}

const validateOldPassword = () => {
    return async (req,res,next) => {
        const {user} = req
        const result = comparePassword(req.body.oldPassword,user.password)
        if (!result) return response(res,false,null,'Old Password not valid',401)
        next()
    }
}

const validateAddPassword = () => {
    return async (req,res,next) => {
        const {user} = req
        if (user.password) return response(res,false,null,'Password not null cant add password',400)
        next()
    }
}

const validateOrderStatusForPayment = () => {
    return async (req,res,next) => {
        const {user} = req
        const order = await Order.findOne({
            include : [
                {
                    model : OrderStatus
                },
                {
                    model : Transaction,
                    attributes : {exclude : ['deletedAt','updatedAt']}
                }
            ],
            where : {
                [Op.and] : [
                    {id : req.params.orderId},
                    {customerId : user.id}
                ]
            },
            order : [
                [OrderStatus,'createdAt','DESC']
            ]
        })
        console.log(order)
        if (!order) return response(res,false,null,'Order not found',400)
        if (order.order_statuses[0].statusType != 1 && order.order_statuses[0].statusType != 2) 
            return response(res,false,null,'Order has been paid',400)
        req.order = order
        next()
    }
}

module.exports = {
    validateRePassword,
    validateEmail,
    validateOldPassword,
    validateAddPassword,
    validateOrderStatusForPayment
}