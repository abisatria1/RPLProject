const Customer = require('../models/customer')
const Category = require('../models/category')
const CategoryPhoto = require('../models/categoryPhoto')
const Room = require('../models/room')
const RoomPhoto = require('../models/roomPhoto')
const category_room = require('../models/category_room')
const Product = require('../models/product')
const ProductPhoto = require('../models/productPhoto')
const Cart = require('../models/cart')
const Order = require('../models/order')
// address
const UserAddress = require('../models/address/userAddress')
const OrderAddress = require('../models/address/orderAddress')

Customer.hasMany(UserAddress)
UserAddress.belongsTo(Customer)

Room.belongsToMany(Category, {as : 'categories', through : category_room})
Category.belongsToMany(Room, {as : 'rooms' ,through : category_room})  

Room.hasMany(RoomPhoto)
RoomPhoto.belongsTo(Room)

Category.hasMany(CategoryPhoto)
CategoryPhoto.belongsTo(Category)

// product
Category.hasMany(Product)
Product.belongsTo(Category)

Product.hasMany(ProductPhoto)
ProductPhoto.belongsTo(Product)

// cart
Customer.hasMany(Cart)
Cart.belongsTo(Customer)

Product.hasMany(Cart)
Cart.belongsTo(Product)

Order.hasMany(Cart)
Cart.belongsTo(Order)

Order.hasOne(OrderAddress)
OrderAddress.belongsTo(Order)
