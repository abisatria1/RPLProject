const Sequelize = require('sequelize')
const db = require('../../config/database')

const OrderAddress = db.define(
    'order_address' ,
    {
        street : {
            type : Sequelize.STRING,
            allowNull : false
        },
        subDistrict : {
            type : Sequelize.STRING,
            allowNull : false
        },
        city : {
            type : Sequelize.STRING,
            allowNull : false
        },
        province : {
            type : Sequelize.STRING,
            allowNull : false
        },
        combineForm : {
            type : Sequelize.STRING,
            get() {
                const street = this.getDataValue('street') 
                const kecamatan = this.getDataValue('subDistrict')
                const city = this.getDataValue('city')
                const province = this.getDataValue('province')
                const result = `${street} , ${kecamatan} , ${city} , ${province}`
                return result
            },
        }
    },
    {paranoid : true},
)

module.exports = OrderAddress