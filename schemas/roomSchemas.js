const Joi = require('joi')

const createRoomSchema = Joi.object().keys({
    roomName : Joi.string().required(),
    roomDesc : Joi.string().allow(""),
})

module.exports = {
    createRoomSchema
}