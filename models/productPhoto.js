const Sequelize = require('sequelize')
const db = require('../config/database')

const ProductPhoto = db.define(
    'productphoto',
    {   
        urlPhoto : {
            type : Sequelize.STRING,
            allowNull : false
        },
        publicId : {
            type : Sequelize.STRING,
            allowNull : false
        }
    },
    {paranoid : true}
)

module.exports = ProductPhoto