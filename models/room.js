const Sequelize = require('sequelize')
const db = require('../config/database')

const room = db.define(
    'room',
    {   
        roomName : {
            type : Sequelize.STRING,
            allowNull : false
        },
        roomDesc : {
            type : Sequelize.STRING
        },
        roomPhoto : {
            type : Sequelize.STRING
        }
    },
    {paranoid : true}
)

module.exports = room