const Customer = require('../models/customer')
const Address = require('../models/address')
const Category = require('../models/category')
const Room = require('../models/room')

Customer.hasMany(Address)
Address.belongsTo(Customer)