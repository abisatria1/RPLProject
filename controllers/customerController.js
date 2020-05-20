const {response,customError} = require('../helpers/wrapper')
const Customer = require('../models/customer')
const {hashPassword,comparePassword} = require('../helpers/hash')
const jwt = require('jsonwebtoken')
const cloudinary = require('../config/cloudinary')

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

const register = async(req,res,next) => {
    let customer = new Customer(req.body)
    customer.password = hashPassword(customer.password)
    await customer.save()
    response(res,true,customer,'Data has been registered',201)
}

const login = async (req,res,next) => {
    const {email,password} = req.body
    const customer = await Customer.findOne({where : {email}})
    if (!customer) return next(customError('Email not valid',401))
    const result = comparePassword(password,customer.password)
    if (!result) return next(customError('Password not valid',401))
    // sign jwt token
    const token = signToken(customer)
    response(res,true,{token},'Login success',200)
}

const getProfile = async (req,res,next) => {
    response(res,true,req.user,'Customer profile has been fetched',200)
}

const updateProfile = async (req,res,next) => {
    const {user} = req
    const {name,phone,gender} = req.body
    if(!user) return next(customError('Customer not found',401))
    user.name = name
    user.phone = phone
    user.gender = gender
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
    if (user.photo) {
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
    if (!user.photo) return response(res,false,null,'No photo profile to delete',422)
    await cloudinary.v2.uploader.destroy(user.publicId)
    user.photo = null
    user.publicId = null
    await user.save()
    response(res,true,user,'Photo profile has been delete',200)
}



module.exports = {
    index,
    register,
    login,
    getProfile,
    updateProfile,
    updateEmail,
    updatePassword,
    updatePhoto,
    deletePhoto
}