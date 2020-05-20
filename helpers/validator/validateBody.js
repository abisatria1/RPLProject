const Joi = require('joi')
const {response} = require('../wrapper')

const validateBody = schema => {
    return (req,res,next) => {
        const result = Joi.validate(req.body,schema)
        if (result.error) return response(res,false,null,result.error.details[0].message,400)
        next()
    }
}

module.exports = {
    validateBody
}