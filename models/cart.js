const Sequelize = require('sequelize')
const db = require('../config/database')

const Cart = db.define(
    'cart',
    {
        quantity : {
            type : Sequelize.INTEGER,
            allowNull : false
        },
        fixedPrice : {
            type : Sequelize.INTEGER,
            allowNull : false
        }
    },
    {paranoid : true}
)

module.exports = Cart