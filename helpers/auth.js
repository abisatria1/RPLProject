const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const {ExtractJwt} = require('passport-jwt')

// addtional
const dotenv = require('dotenv').config()
const {customError} = require('./wrapper')
const Customer = require('../models/customer')

passport.use(new jwtStrategy({
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey : process.env.API_KEY
} , async(payload,done) => {
    try {
        const now = Date.now()
        const exp = payload.exp * 1000
        console.log(`Now ${now} and exp ${exp}`)
        if (Date.now() >= payload.exp * 1000) return done(customError('Token has expired',401))
        // find customer
        const customer = await Customer.findByPk(payload.sub)
        if (!customer) return done(customError('Customer not found' ,401))
        done(null,customer)
    } catch (err) {
        console.log(err.message)
        done(err,false)
    }
}))