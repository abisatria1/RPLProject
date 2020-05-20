const Sequelize = require('sequelize')
const db = require('../config/database')

const Address = db.define(
    'customerAddress' ,
    {
        street : {
            type : Sequelize.STRING,
            allowNull : false
        }
    }
)

module.exports = Address