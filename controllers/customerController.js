const {response,customError} = require('../helpers/wrapper')
const Customer = require('../models/customer')
const {hashPassword,comparePassword} = require('../helpers/hash')
const jwt = require('jsonwebtoken')
const cloudinary = require('../config/cloudinary')
const Transaction = require('../models/payment/transaction')
const PaymentMethod = require('../models/payment/paymentMethod')
const Cart = require('../models/cart')
const Product = require('../models/product')
const ProductPhoto = require('../models/productPhoto')
const Courier = require('../models/courier')
const OrderAddress = require('../models/address/orderAddress')
const City = require('../models/location/city')
const Province = require('../models/location/province')
const OrderStatus = require('../models/orderStatus')
const Op = require('sequelize').Op
const db = require('../config/database')
const Order = require('../models/order')
const mail = require('../config/mail')
const randomstring = require('randomstring')

const signToken = customer => {
    return token = jwt.sign({
        iss : 'abisatria',
        sub : customer.id,
        iat : Date.now()
    } , process.env.API_KEY , {expiresIn : '24h'})
}

const index = async (req,res,next) => {
    const customer = await Customer.findAll({})
    response(res,true,customer,'All data has been fetched',200)
}

// auth
const register = async(req,res,next) => {
    const emailToken = randomstring.generate({
        length: 4,
        charset: 'numeric'
    })
    const customer = await Customer.create({
        ...req.body,
        isVerified : 'false',
        emailToken,
        password : hashPassword(req.body.password)
    })
    console.log(customer)
    // send email
    await mail.sendMailVerification(customer.email,emailToken)
    const token = signToken(customer)
    response(res,true,{token},'Data has been registered',201)
}

const login = async (req,res,next) => {
    const {email,password} = req.body
    const customer = await Customer.findOne({where : {email}})
    if (!customer) return next(customError('Email not valid',401))
    if (!customer.password) return next(customError('Password not created yet, please login using google',401))
    const result = comparePassword(password,customer.password)
    if (!result) return next(customError('Password not valid',401))
    // sign jwt token
    const token = signToken(customer)
    response(res,true,{token},'Login success',200)
}

const loginGoogle = async (req,res,next) => {
    const user = req.user[0]
    user.isVerified = 'true'
    await user.save()
    const token = signToken(user)
    response(res,true,{token},'Login success',200)
}

const verifyEmail = async (req,res,next) => {
    const {emailToken} = req.body
    const {user} = req
    if (user.isVerified == 'true') return next(customError('User has been verified',400))
    if (user.emailToken != emailToken) return next(customError('Token not valid',400))
    const update = await user.update({isVerified : 'true',emailToken : null})
    response(res,true,{isVerified : update.isVerified},'Success verify email',200)
}

const verifyForgotPassToken = async (req,res,next) => {
    const {forgotPassToken,email} = req.body
    const user = await Customer.findOne({where : {email}})
    if (!user) return next(customError('User not found',400))
    if (user.forgotPassToken != forgotPassToken) return next(customError('Token not valid',400))
    const update = await user.update({forgotPassToken : null})
    const jwtToken = signToken(user)
    response(res,true,{token:jwtToken},'Success verify forgot pass token',200)
}

const resendToken = async (req,res,next) => {
    const {user} = req
    if (user.isVerified == 'true') return next(customError('user has been verified',400))
    user.emailToken = randomstring.generate({
        length: 4,
        charset: 'numeric'
    })
    await user.save()
    await mail.sendMailVerification(user.email,user.emailToken)
    response(res,true,{},'Success resend token',200)
}

const forgotPassword = async (req,res,next) => {
    const {email} = req.body
    const user = await Customer.findOne({where : {email}})
    if (!user) return next(customError('Email not registered',400))
    if (!user.password || user.password == null) 
        return next(customError('Password not created yet, please login using google',400))
    const token = randomstring.generate({
        length: 4,
        charset: 'numeric'
    })
    await user.update({forgotPassToken : token})
    await mail.sendMailResetPassword(email,token)
    response(res,true,{},'Please check your email for reset password token',200)
}

// end for auth

const getProfile = async (req,res,next) => {
    const {user} = req
    response(res,true,{
        id : user.id,
        name : user.name,
        phone : user.phone,
        photo : user.photo,
        email : user.email,
        password : user.password,
        isVerified : user.isVerified
    },'Customer profile has been fetched',200)
}

const updateProfile = async (req,res,next) => {
    const {user} = req
    const {name,phone} = req.body
    if(!user) return next(customError('Customer not found',401))
    user.name = name
    user.phone = phone
    await user.save()
    response(res,true,user,'User data has been update',200)
}

const updateEmail = async (req,res,next) => {
    const {user} = req
    if(!user) return next(customError('Customer not found',401))
    user.email = req.body.email
    await user.save()
    response(res,true,user,'User email has been update',200)

}

const updatePassword = async (req,res,next) => {
    const {user} = req
    if(!user) return next(customError('Customer not found',401))
    user.password = hashPassword(req.body.password)
    await user.save()
    response(res,true,user,'User password has been update',200)
}

const updatePhoto = async (req,res,next) => {
    const {user} = req
    if (user.publicId) {
        await cloudinary.v2.uploader.destroy(user.publicId)
    }
    const photo = req.file.url
    const publicId = req.file.public_id
    user.photo = photo
    user.publicId = publicId
    await user.save()
    response(res,true,user,'Photo profile has been update',200)
}

const deletePhoto = async (req,res,next) => {
    const {user} = req
    if (!user.publicId) return next(customError('No photo profile to delete',422))
    await cloudinary.v2.uploader.destroy(user.publicId)
    user.photo = null
    user.publicId = null
    await user.save()
    response(res,true,user,'Photo profile has been delete',200)
}

const addPassword = async (req,res,next) => {
    const {user} = req
    user.password = hashPassword(req.body.password)
    await user.save()
    response(res,true,user,'Password has been added',200)
}


const getAllOrder = async (req,res,next) => {
    const {user} = req
    const {condition} = req.query
    let includeCondition
    if (condition != 'ongoing' && condition != 'all' && condition != 'history')  
        return next(customError('Query invalid',400))

    if (condition == 'ongoing') {
        includeCondition = {
            [Op.and] : [
                db.literal(`
                NOT EXISTS (
                    SELECT orderId, statusType FROM order_statuses s
                    WHERE s.orderId = order.id
                    AND (statusType = 5 OR statusType = -1)
                )`)
            ]
        }
    }else if (condition == 'history') {
        includeCondition = {
            [Op.and] : [
                db.literal(`
                EXISTS (
                    SELECT orderId, statusType FROM order_statuses s
                    WHERE s.orderId = order.id
                    AND (statusType = 5 OR statusType = -1)
                )`)
            ]
        }
    }
    const order = await user.getOrders({
        attributes : {exclude : ['deletedAt','customerId']},
        include : [
            {
                model : OrderStatus,
                attributes : {exclude : ['updatedAt','deletedAt']},
            },
            {
                attributes : {exclude : ['updatedAt','deletedAt']},
                model : OrderAddress,
                include : [City,Province]
            },
            {
                model : Courier,
                attributes : {exclude : ['updatedAt','deletedAt']},
            },
            {
                model : Transaction,
                attributes : {exclude : ['deletedAt','orderId','paymentMethodId']},
                include : [{
                    model : PaymentMethod,
                    attributes : {exclude : ['createdAt','updatedAt','deletedAt']},
                }]
            },
            {
                model : Cart,
                attributes : {exclude : ['createdAt','updatedAt','deletedAt']},
                include : [{
                    attributes : {exclude : ['createdAt','updatedAt','deletedAt']},
                    model : Product,
                    include : [{
                        model : ProductPhoto,
                        attributes : {exclude : ['createdAt','updatedAt','deletedAt']},
                    }]
                }],
            },
        ],
        order : [
            [OrderStatus, 'createdAt', 'DESC']
        ],
        where : includeCondition
    })
    response(res,true,order,'Success get all order',200)
}

const getDetailOrder = async (req,res,next) => {
    const {orderId} = req.params
    const order = await Order.findOne({
        include : [
            {
                model : OrderStatus,
                attributes : {exclude : ['updatedAt','deletedAt']},
            },
            {
                attributes : {exclude : ['updatedAt','deletedAt']},
                model : OrderAddress,
                include : [City,Province]
            },
            {
                model : Courier,
                attributes : {exclude : ['updatedAt','deletedAt']},
            },
            {
                model : Transaction,
                attributes : {exclude : ['deletedAt','orderId','paymentMethodId']},
                include : [{
                    model : PaymentMethod,
                    attributes : {exclude : ['createdAt','updatedAt','deletedAt']},
                }]
            },
            {
                model : Cart,
                attributes : {exclude : ['createdAt','updatedAt','deletedAt']},
                include : [{
                    attributes : {exclude : ['createdAt','updatedAt','deletedAt']},
                    model : Product,
                    include : [{
                        model : ProductPhoto,
                        attributes : {exclude : ['createdAt','updatedAt','deletedAt']},
                    }]
                }],
            },
        ],
        where : {
            [Op.and] : [
                {id : orderId},
                {customerId : req.user.id}
            ]
        },
        order : [
            [OrderStatus, 'createdAt', 'DESC']
        ],
    })
    response(res,true,order,'Success get detail order',200)
}

const getPaymentInformation = async (req,res,next) => {
    const {orderId} = req.params
    const paymentInformation = await Order.findOne({
        attributes : {exclude : ['customerId','updatedAt','deletedAt']},
        include : [{
            model : Transaction,
            attributes : {exclude : ['updatedAt','deletedAt','orderId','paymentMethodId']},
            include : [{
                model : PaymentMethod,
                attributes : {exclude : ['createdAt','updatedAt','deletedAt']}
            }]
        }],
        where : {
            [Op.and] : [
                {id : orderId},
                {customerId : req.user.id}
            ]
        }
    })
    if (!paymentInformation) return next(customError('Order not found',400))
    response(res,true,paymentInformation,'Success get payment information',200)
}

const uploadPaymentPhoto = async (req,res,next) => {
    const {file,order} = req
    const update = await order.transaction.update({
        transactionPhoto : file.url,
        publicId : file.public_id
    })
    // create order status
    const orderStatus = await OrderStatus.create({statusType : 2, orderId : order.id})
    response(res,true,{transaction : update, orderStatus},'Success upload payment photo',200)
}

module.exports = {
    index,
    register,
    login,
    verifyEmail,
    verifyForgotPassToken,
    forgotPassword,
    resendToken,
    getProfile,
    updateProfile,
    updateEmail,
    updatePassword,
    updatePhoto,
    deletePhoto,
    loginGoogle,
    addPassword,
    getAllOrder,
    getDetailOrder,
    getPaymentInformation,
    uploadPaymentPhoto
}