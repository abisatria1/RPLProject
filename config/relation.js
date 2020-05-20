const Customer = require('../models/customer')
const Address = require('../models/address')

Customer.hasMany(Address)
Address.belongsTo(Customer)