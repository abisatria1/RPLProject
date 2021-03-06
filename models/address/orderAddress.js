const Sequelize = require('sequelize')
const db = require('../../config/database')

const OrderAddress = db.define(
    'order_address' ,
    {
        street : {
            type : Sequelize.STRING,
            allowNull : false
        }
    },
    {paranoid : true},
)

module.exports = OrderAddress