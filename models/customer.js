const Sequelize = require('sequelize')
const db = require('../config/database')

const Customer = db.define(
    'customer', 
    {
        name : {
            type : Sequelize.STRING
        },
        phone : {
            type : Sequelize.STRING
        },
        photo : {
            type : Sequelize.STRING
        },
        publicId : {
            type : Sequelize.STRING
        },
        email : {
            type : Sequelize.STRING,
            allowNull : false
        },
        password : {
            type : Sequelize.STRING
        },
        // email verification and forgot password
        emailToken : {
            type : Sequelize.STRING,
        },
        forgotPassToken : {
            type : Sequelize.STRING
        },
        isVerified : {
            type  : Sequelize.STRING
        }
        
    },
    {paranoid : true}
)

module.exports = Customer