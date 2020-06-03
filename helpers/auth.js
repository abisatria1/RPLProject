const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const {ExtractJwt} = require('passport-jwt')
const googleStrategy = require('passport-google-plus-token')

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

// google auth
passport.use("googleToken" , new googleStrategy (
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken , refreshToken , profile, done) => {
        try {
            const email = profile.emails[0].value
            const name = profile.displayName
            const photo = profile.photos[0].value
            const result = await Customer.findOrCreate(
                {
                    where : {email},
                    defaults : {
                        name,
                        photo,
                        email,
                    }
                }
            )
            done(null,result)
        } catch (err) {
            console.log(err.message)
            done(err,false)
        }
    }
))