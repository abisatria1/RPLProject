const Sequelize = require('sequelize')
const db = require('../config/database')

const categoryPhoto = db.define(
    'categoryPhoto',
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

module.exports = categoryPhoto