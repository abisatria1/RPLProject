const Sequelize = require('sequelize')
const db = require('../../config/database')

const UserAddress = db.define(
    'user_address' ,
    {
        street : {
            type : Sequelize.STRING,
            allowNull : false
        }
    },
    {
        paranoid : true,
    },
)

module.exports = UserAddress