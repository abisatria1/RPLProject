const Sequelize = require('sequelize')
const db = require('../config/database')

const category = db.define(
    'category',
    {
        categoryName : {
            type : Sequelize.STRING,
            allowNull : false
        },
        categoryDesc : {
            type : Sequelize.STRING
        },
        categoryPhoto : {
            type : Sequelize.STRING
        }
    },
    {paranoid : true}
)

module.exports = category