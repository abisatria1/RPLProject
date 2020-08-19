const Joi = require('joi')

const createCategorySchema = Joi.object().keys({
    categoryName : Joi.string().required(),
    categoryDesc : Joi.string().allow(""),
})

module.exports = {
    createCategorySchema
}