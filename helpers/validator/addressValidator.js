const {response} = require('../wrapper')
const City = require('../../models/location/city')
const Province = require('../../models/location/province')
const Op = require('sequelize').Op

const fillProvinceData = () => {
    return async (req,res,next) => {
        const {cityId} = req.body
        const city = await City.findOne({
            where : {id : cityId},
            include : [Province]
        })
        req.body.provinceId = city.province.id
        next()
    }
}

module.exports = {
    fillProvinceData
}