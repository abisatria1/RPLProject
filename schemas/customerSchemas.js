const Joi = require('joi')

const registerSchema = Joi.object().keys({
    email : Joi.string().email().required(),
    password : Joi.string().required().min(6),
    rePassword : Joi.string().required().min(6),
    phone : Joi.string().required().min(6)
})

const loginSchema = Joi.object().keys({
    email : Joi.string().email().required(),
    password : Joi.string().required().min(6),
})

const updateProfileSchema = Joi.object().keys({
    name : Joi.string().min(3).required(),
    phone : Joi.string().min(6).required()
})

const updateEmailSchema = Joi.object().keys({
    email : Joi.string().email().required()
})

const updatePasswordSchema = Joi.object().keys({
    oldPassword : Joi.string().min(6).required(),
    password : Joi.string().min(6).required(),
    rePassword : Joi.string().min(6).required()
})

const addPasswordSchema = Joi.object().keys({
    password : Joi.string().min(6).required(),
    rePassword : Joi.string().min(6).required()
})


module.exports = {
    registerSchema,
    loginSchema,
    updateEmailSchema,
    updateProfileSchema,
    updatePasswordSchema,
    updatePhotoSchema,
    addPasswordSchema
}