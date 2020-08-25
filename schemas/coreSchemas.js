const Joi = require('joi')

const addItemsToCartSchema = Joi.object().keys({
    productId : Joi.number().min(1).required(),
    quantity : Joi.number().min(1).required()
})

const updateCartItem = Joi.object().keys({
    quantity : Joi.number().min(1).required()
})

const confirmOrder = Joi.object().keys({
    order : Joi.array().items(
        Joi.object({
            cartId : Joi.number().min(1).required(),
        })
    ).required(),
    address : Joi.object({
        street : Joi.string().required(),
        cityId : Joi.number().min(1).required(),
        provinceId : Joi.number().min(1).required()
    }).required(),
    courier : Joi.object({
        courierName : Joi.string().required(),
        courierService : Joi.string().required(),
        courierFee : Joi.number().min(0).required()
    }).required(),
    paymentMethod : Joi.object({
        paymentMethodId : Joi.number().min(1).required()
    }).required()
})

module.exports = {
    addItemsToCartSchema,
    updateCartItem,
    confirmOrder
}