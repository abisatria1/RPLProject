const Sequelize = require('sequelize')
const db = require('../config/database')

const Courier = db.define(
    'courier' ,
    {
        courierName : {
            type : Sequelize.STRING,
            allowNull : false
        },
        courierService : {
            type : Sequelize.STRING
        },
        courierFee : {
            type : Sequelize.INTEGER
        }
    },
    {
        paranoid : true,
    },
)

module.exports = Courier