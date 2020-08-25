const {response,customError} = require('../helpers/wrapper')
const axios = require('axios')
const dotenv = require('dotenv').config()
const Op = require('sequelize').Op
// model
const Province = require('../models/location/province')
const City = require('../models/location/city')

const baseURl = process.env.RAJA_ONGKIR_BASEURL
const apiKey = process.env.RAJA_ONGKIR_API_KEY
axios.defaults.baseURL = baseURl
axios.defaults.headers.common['key'] = apiKey

const getProvince = async (req,res,next) => {
    const {provinceId} = req.query
    let provinceIdCondition
    if (provinceId) provinceIdCondition = {where : {id : provinceId}}
    const provinces = await Province.findAll({
        ...provinceIdCondition,
        attributes : ['id','provinceName']
    })
    response(res,true,provinces,'Success get provinces data',200)
}

const getCity = async (req,res,next) => {
    const {provinceId,cityId} = req.query
    let provinceCondition,cityCondition
    if (provinceId) provinceCondition = {where : {id : provinceId}}
    if (cityId) cityCondition = {where : {id : cityId}}
    const city = await City.findAll({
        attributes : ['id','cityName','type'],
        include : [{
            model : Province,
            attributes : ['id','provinceName'],
            ...provinceCondition
        }],
        ...cityCondition
    })
    response(res,true,city,'Success get city',200)
}

const searchProvince = async (req,res,next) => {
    const {key} = req.query
    if (!key) return response(res,true,[],'Success',200)
    const provinces = await Province.findAll({
        where : {
            provinceName : {
                [Op.like] : `%${key}%`
            }
        }
    })
    response(res,true,provinces,'Success',200)
}

const searchCity = async (req,res,next) => {
    const {key} = req.query
    if (!key) return response(res,true,[],'Success',200)
    const city = await City.findAll({
        where : {
            cityName : {
                [Op.like] : `%${key}%`
            }
        }
    })
    response(res,true,city,'Success',200)
}

const courierFee = async (req,res,next) => {
    const fee = await axios.post('/starter/cost' , {origin : 23, ...req.body}) //origin bandung
    response(res,true,fee.data.rajaongkir.results[0],'Success',200)
}


module.exports = {
    getProvince,
    getCity,
    searchProvince,
    searchCity,
    courierFee
}