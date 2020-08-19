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
            type : Sequelize.TEXT
        }
    },
    {paranoid : true,}
)

module.exports = category