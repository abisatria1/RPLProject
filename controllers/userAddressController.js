const Address = require('../models/address/userAddress')
const Customer = require('../models/customer')
const {response,customError} = require('../helpers/wrapper')
const City = require('../models/location/city')
const Province = require('../models/location/province')

const viewAddress = async (req,res,next) => {
    const {user} = req
    const address = await user.getUser_addresses({
        include : [City,Province]
    })
    response(res,true,address,'All address has been fetched',200)
}

const addAddress = async (req,res,next) => {
    const {user} = req
    req.body.customerId = user.id
    const address = await Address.create(req.body)
    response(res,true,address,'Address has been added to user',201)
}

const getDetailAddress = async (req,res,next) => {
    const {user} = req
    const address = await user.getUser_addresses({
        where : {id : req.params.addressId},
        include : [City,Province]
    })
    if (!address.length) return next(customError('Address not found',400))
    response(res,true,address[0],'Successfully get address',200)
}

const updateAddress = async (req,res,next) => {
    const {user} = req
    const address = await user.getUser_addresses({
        where : {id : req.params.addressId},
        include : [City,Province]
    })
    if (!address.length) return next(customError('Address not found',400))
    const update = await address[0].update(req.body)
    response(res,true,{},"Successfully update address",200)
}

const deleteAddress = async (req,res,next) => {
    const {user} = req
    const address = await user.getUser_addresses({
        where : {id : req.params.addressId},
        include : [City,Province]
    })
    if (!address.length) return next(customError('Address not found',400))
    const result = await address[0].destroy({force : true})
    response(res,true,{},"Address has been deleted",200)
}



module.exports  = {
    addAddress,
    getDetailAddress,
    updateAddress,
    deleteAddress,
    viewAddress
}