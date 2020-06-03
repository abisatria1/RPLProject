const Address = require('../models/address')
const Customer = require('../models/customer')
const {response,customError} = require('../helpers/wrapper')

const viewAddress = async (req,res,next) => {
    const {user} = req
    const address = await user.getAddresses()
    response(res,true,address,'All address has been fetched',200)
}

const addAddress = async (req,res,next) => {
    const {user} = req
    const address = await Address.create(req.body)
    address.customerId = user.id
    await address.save()
    response(res,true,address,'Address has been added to user',201)
}

const updateAddress = async (req,res,next) => {
    const address = await Address.findByPk(req.params.addressId)
    if(!address) return response(res,false,null,"Address not found",400)
    address.street = req.body.street
    address.city = req.body.city
    await address.save()
    response(res,true,address,"Successfully update address",200)
}

const deleteAddress = async (req,res,next) => {
    const address = await Address.findByPk(req.params.addressId)
    if(!address) return response(res,false,null,"Address not found",400)
    const result = await address.destroy()
    response(res,true,{},"Address has been deleted",200)
}



module.exports  = {
    addAddress,
    updateAddress,
    deleteAddress,
    viewAddress
}