const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
// another file
const {response} = require('./helpers/wrapper')
const cors = require('cors')

// database and relation
const db = require('./config/database')
const relation = require('./config/relation')

// middleware
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use(cors())

// router
const customerRouter = require('./routes/customerRoutes')
const addressRouter = require('./routes/addressRoutes')
const roomRouter = require('./routes/roomRoutes')
const categoryRouter = require('./routes/categoryRoutes')
const productRouter = require('./routes/productRoutes')
const searchRouter = require('./routes/searchRoutes')
const coreRouter = require('./routes/coreRoutes')

app.use('/api/customer', customerRouter)
app.use('/api/customer/address', addressRouter)
app.use('/api/room', roomRouter)
app.use('/api/category', categoryRouter)
app.use('/api/product', productRouter)
app.use('/api/search', searchRouter)
app.use('/api/core', coreRouter)

app.use('/unauthorized' , (req,res,next) => {
    let err = new Error ('Unauthorized access')
    err.status = 401
    next(err)
})

app.use('/hello' , (req,res,next) => res.send('Application successfuly deploy, welcome to the API'))
// error handling
app.use((req,res,next) => {
    let err = new Error('Route not found')
    err.status = 404
    next(err)
})

app.use((err,req,res,next) => {
    const {message} = err
    const status = err.status || 500
    const data = err.data || null
    response(res,false,data,message,status)
})


const port = process.env.PORT || 3000

app.listen(port , () => {
    db.sync({force : false})
    .then(() => console.log(`app is running on port ${port}`))
    .catch(err => console.log(err.message))
}) 