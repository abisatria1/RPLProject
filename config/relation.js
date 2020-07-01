const Customer = require('../models/customer')
const Address = require('../models/address')
const Category = require('../models/category')
const Room = require('../models/room')

Customer.hasMany(Address)
Address.belongsTo(Customer)

Room.belongsToMany(Category, {as : 'rooms', through : 'category_room'})
Category.belongsToMany(Room, {as : 'categories' ,through : 'category_room'})