const Joi = require('joi')

const addAddress = Joi.object().keys({
    street : Joi.string().required(),
    subDistrict : Joi.string().required(),
    city : Joi.string().required(),
    province : Joi.string().required()
})

module.exports = {
    addAddress
}