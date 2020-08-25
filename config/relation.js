const Customer = require('../models/customer')
const Category = require('../models/category')
const CategoryPhoto = require('../models/categoryPhoto')
const Room = require('../models/room')
const RoomPhoto = require('../models/roomPhoto')
const category_room = require('../models/category_room')
const Product = require('../models/product')
const ProductPhoto = require('../models/productPhoto')
const Cart = require('../models/cart')
// address
const UserAddress = require('../models/address/userAddress')
const OrderAddress = require('../models/address/orderAddress')
const Province = require('../models/location/province')
const City = require('../models/location/city')

// order n payment
const Order = require('../models/order')
const PaymentMethod = require('../models/payment/paymentMethod')
const Transaction = require('../models/payment/transaction')
const Courier = require('../models/courier')
const OrderStatus = require('../models/orderStatus')

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

// location
Order.hasOne(OrderAddress)
OrderAddress.belongsTo(Order)

Province.hasMany(City)
City.belongsTo(Province)

OrderAddress.belongsTo(Province)
Province.hasOne(OrderAddress)

City.hasOne(OrderAddress)
OrderAddress.belongsTo(City)

UserAddress.belongsTo(Province)
Province.hasOne(UserAddress)

City.hasOne(UserAddress)
UserAddress.belongsTo(City)

// payment
Order.hasOne(Transaction)
Transaction.belongsTo(Order)

Transaction.belongsTo(PaymentMethod)
PaymentMethod.hasMany(Transaction)

Order.hasOne(Courier)
Courier.belongsTo(Order)

// order
Customer.hasMany(Order)
Order.belongsTo(Customer)

Order.hasMany(OrderStatus)
OrderStatus.belongsTo(Order)

// PaymentMethod.bulkCreate([
//     {paymentBank : "Bank Mandiri" , paymentAccountName : "abisatria", paymentAccountNumber : "09313209190"},
//     {paymentBank : "Bank BRI" , paymentAccountName : "abisatria", paymentAccountNumber : "079489127"},
//     {paymentBank : "Bank BCA" , paymentAccountName : "abisatria", paymentAccountNumber : "31231235"},
//     {paymentBank : "Bank BNI" , paymentAccountName : "abisatria", paymentAccountNumber : "32123085"},
// ])