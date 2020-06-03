const Joi = require('joi')

const addAddress = Joi.object().keys({
    street : Joi.string().required(),
    city : Joi.string().required()
})

module.exports = {
    addAddress
}