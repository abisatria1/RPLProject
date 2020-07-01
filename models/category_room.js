const Sequelize = require('sequelize')
const db = require('../config/database')

const category_room = db.define(
    'category_room',
    {
        id : {
            type : Sequelize.INTEGER,
            allowNull : false,
            autoIncrement : true,
            primaryKey : true
        }
    },
    {
        paranoid : true
    }
)

module.exports = category_room