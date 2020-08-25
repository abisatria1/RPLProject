const Sequelize = require('sequelize')
const db = require('../../config/database')

const PaymentMethod = db.define(
    'payment_method' ,
    {
        paymentAccountName : {
            type : Sequelize.STRING,
            allowNull : false
        },
        paymentAccountNumber : {
            type : Sequelize.STRING
        },
        paymentBank : {
            type : Sequelize.STRING,
            allowNull : false
        }
    },
    {
        paranoid : true,
    },
)

module.exports = PaymentMethod