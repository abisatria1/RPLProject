const Sequelize = require('sequelize')
const db = require('../config/database')

const Address = db.define(
    'address' ,
    {
        street : {
            type : Sequelize.STRING,
            allowNull : false
        },
        city : {
            type : Sequelize.STRING,
            allowNull : false
        },
    },
    {paranoid : true},
)

module.exports = Address