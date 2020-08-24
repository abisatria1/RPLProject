const Sequelize = require('sequelize')
const db = require('../config/database')

const Order = db.define(
    'order',
    {
        orderCode : {
            type : Sequelize.STRING,
            set () {
                const date = new Date(Date.now())
                this.setDataValue('orderCode',`ORDER#${date}`)
            }
        },
        orderPriceTotal : {
            type : Sequelize.INTEGER,
            allowNull : false
        }
    },
    {paranoid : true}
)

module.exports = Order