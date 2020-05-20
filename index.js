const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
// another file
const {response} = require('./helpers/wrapper')

// database and relation
const db = require('./config/database')
const relation = require('./config/relation')

// middleware
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())

// router
const customerRouter = require('./routes/customerRouter')

app.use('/api/customer', customerRouter)

// error handling
app.use((req,res,next) => {
    let err = new Error('Route not found')
    err.status = 404
    next(err)
})

app.use((err,req,res,next) => {
    const {message} = err
    response(res,false,null,message,500)
})


const port = process.env.PORT || 3000

app.listen(port , () => {
    db.sync({})
    .then(() => console.log(`app is running on port ${port}`))
    .catch(err => console.log(err.message))
}) 