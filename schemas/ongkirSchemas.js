const Joi = require('joi')

const courierFeeSchema = Joi.object().keys({
    destination : Joi.number().min(1).required(),
    weight : Joi.number().min(1).required(),
    courier : Joi.string().required()
})

module.exports = {
    courierFeeSchema
}