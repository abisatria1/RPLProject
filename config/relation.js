const Customer = require('../models/customer')
const Address = require('../models/address')
const Category = require('../models/category')
const CategoryPhoto = require('../models/categoryPhoto')
const Room = require('../models/room')
const RoomPhoto = require('../models/roomPhoto')
const category_room = require('../models/category_room')

Customer.hasMany(Address)
Address.belongsTo(Customer)

Room.belongsToMany(Category, {as : 'categories', through : category_room})
Category.belongsToMany(Room, {as : 'rooms' ,through : category_room})  

Room.hasMany(RoomPhoto)
RoomPhoto.belongsTo(Room)

Category.hasMany(CategoryPhoto)
CategoryPhoto.belongsTo(Category)