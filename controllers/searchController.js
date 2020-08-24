const {response,customError} = require('../helpers/wrapper')
const Op = require('sequelize').Op
const sequelize = require('../config/database')

// model 
const Product = require('../models/product')
const ProductPhoto = require('../models/productPhoto')
const Category = require('../models/category')
const Room = require('../models/room')

const searchProduct = async (req,res,next) => {
    const {key} = req.params
    const keyCondition = `%${key}%`
    const products = await Product.findAll({
        include : [
            {
                model : Category,
                include : [{
                    model : Room,
                    as : 'rooms'
                }]
            },
            {
                model : ProductPhoto
            }
        ],
        where : {
            [Op.or] : [
                sequelize.where(sequelize.col('category.categoryName'),'LIKE',keyCondition),
                sequelize.where(sequelize.col('category.rooms.roomName'),'LIKE',keyCondition),
                {productName : {[Op.like] : keyCondition}}
            ]
        }
    })
    response(res,true,products,'Products has been fetched',200)
}

const newProductRecommendation = async (req,res,next) => {
    const endDate = new Date(Date.now())
    const startDate = new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString() //7 hari kebelakang

    const products = await Product.findAll({
        include : [{
            model : ProductPhoto
        }],
        where : {
            createdAt : {
                [Op.and] : [
                    {[Op.gte] : `${startDate}`},
                    {[Op.lte] : `${endDate.toISOString()}`}
                ]
            }
        },
        order : [
            ['createdAt','DESC']
        ]
    })
    response(res,true,products,'Products has been fetched',200)
}

const productRecommendation = async (req,res,next) => {
    const products = await Product.findAll({
        include : [{
            model : ProductPhoto
        }],
        order : sequelize.random()
    })
    response(res,true,products,'Products has been fetched',200)
}

const similarProductRecommendatiion = async (req,res,next) => {
    const {productId} = req.params
    const product = await Product.findOne({
        include : [Category],
        where : {id : productId}
    })
    if (!product) return next(customError('Product not found',400))
    const categoryId = product.category.id
    const products = await Product.findAll ({
        include : [
            {
                model : Category,
                where : {id : categoryId}
            },
            {
                model : ProductPhoto
            }
        ],
        where : {id : {[Op.not] : productId}},
        order : sequelize.random()
    })
    response(res,true,products,'Products has been fetched',200)
}

module.exports = {
    searchProduct,
    newProductRecommendation,
    productRecommendation,
    similarProductRecommendatiion
}