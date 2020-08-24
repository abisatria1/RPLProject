const Joi = require('joi')

const addItemsToCartSchema = Joi.object().keys({
    productId : Joi.number().min(1).required(),
    quantity : Joi.number().min(1).required()
})

const updateCartItem = Joi.object().keys({
    quantity : Joi.number().min(1).required()
})
module.exports = {
    addItemsToCartSchema,
    updateCartItem
}