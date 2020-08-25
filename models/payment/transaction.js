const Sequelize = require('sequelize')
const db = require('../../config/database')

const Transaction = db.define(
    'transaction' ,
    {
        transactionCode : {
            type : Sequelize.STRING,
            allowNull : false
        },
        transactionStatus : {
            type : Sequelize.STRING,
            allowNull : false
        },
        urlPhoto : {
            type : Sequelize.STRING,
        },
        publicId : {
            type : Sequelize.STRING,
        }
    },
    {
        paranoid : true,
    },
)

module.exports = Transaction