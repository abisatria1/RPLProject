const Sequelize = require('sequelize')
const db = require('../../config/database')

const Province = db.define(
    'province' ,
    {
        provinceName : {
            type : Sequelize.STRING,
            allowNull : false
        }
    },
    {
        paranoid : true,
    },
)

module.exports = Province