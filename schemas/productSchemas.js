const Joi = require('joi')

const createProductSchema = Joi.object().keys({
    productName : Joi.string().required(),
    productPrice : Joi.number().required(),
    productStock : Joi.number().required(),
    productDesc : Joi.string().allow(""),
})

module.exports = {
    createProductSchema
}