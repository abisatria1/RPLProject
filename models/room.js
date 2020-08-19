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
            type : Sequelize.TEXT
        }
    },
    {
        paranoid : true,
        hooks: {
            afterDestroy: async (room, options) => {
                const result = await room.getRoomphotos()
                const categories = await room.getCategories()
                for (let i = 0; i < result.length; i++) {
                    await result[i].destroy()
                }
                for (let i = 0; i < categories.length; i++) {
                    await categories[i].rooms.destroy()
                }
            }
        }
    }
)

module.exports = room