const Joi = require('joi')

const addAddress = Joi.object().keys({
    street : Joi.string().required(),
    cityId : Joi.number().min(1).required(),
})

module.exports = {
    addAddress
}