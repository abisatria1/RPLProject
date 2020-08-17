const Sequelize = require('sequelize')
const db = require('../config/database')

const roomPhoto = db.define(
    'roomphoto',
    {   
        urlPhoto : {
            type : Sequelize.STRING,
            allowNull : false
        },
        publicId : {
            type : Sequelize.STRING,
            allowNull : false
        }
    },
    {paranoid : true}
)

module.exports = roomPhoto