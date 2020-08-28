const Sequelize = require('sequelize')
const db = require('../config/database')

const OrderStatus = db.define(
    'order_status',
    {
        statusType : {
            type : Sequelize.INTEGER,
            allowNull : false,
            set (value) {   
                let name = "", desc = ""
                switch (value) {
                    case 1:
                        name = "Waiting For Payment"
                        desc = "Please pay your order to process your item"
                        break
                    case 2:
                        name = "Waiting Payment Confirmation"
                        desc = "Your payment has been processes, please wait for confirmation"
                        break
                    case 3:
                        name = "Packing"
                        desc = "We are currently preparing your order"
                        break
                    case 4:
                        name = "Shipping"
                        desc = "We have sent your order to your place according to the courier you ordered"
                        break
                    case 5:
                        name = "Completed"
                        desc = "Your order has been completed successfully"
                        break
                    case -1:
                        name = "Cancel"
                        desc = "Order has been canceled"
                        break
                    default:
                        break
                }
                this.setDataValue('statusName', name)
                this.setDataValue('statusDesc' , desc)
                this.setDataValue('statusType' , value)
            }
        },
        statusName : {
            type : Sequelize.STRING
        },
        statusDesc : {
            type : Sequelize.STRING
        }
    },
    {
        paranoid : true
    }
)

module.exports = OrderStatus


