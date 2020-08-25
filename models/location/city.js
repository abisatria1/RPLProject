const Sequelize = require('sequelize')
const db = require('../../config/database')

const City = db.define(
    'city' ,
    {
        cityName : {
            type : Sequelize.STRING,
            allowNull : false
        },
        type : {
            type : Sequelize.STRING
        }
    },
    {
        paranoid : true,
    },
)

module.exports = City