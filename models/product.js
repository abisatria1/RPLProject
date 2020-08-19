const Sequelize = require('sequelize')
const db = require('../config/database')

const Product = db.define(
    'product',
    {
        productName : {
            type : Sequelize.STRING,
            allowNull : false
        },
        productPrice : {
            type : Sequelize.INTEGER,
            allowNull : false
        },
        productStock : {
            type : Sequelize.INTEGER,
            defaultValue : 0
        },
        productDesc : {
            type : Sequelize.TEXT
        }
    },
    {paranoid : true}
)

module.exports = Product