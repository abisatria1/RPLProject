const {response,customError} = require('../helpers/wrapper')
const cloudinary = require('../config/cloudinary')

// model 
const Product = require('../models/product')
const ProductPhoto = require('../models/productPhoto')
const Category = require('../models/category')
const Room = require('../models/room')

const deleteCloudinaryPhoto = async (arrPhoto) => {
    for (let i = 0; i < arrPhoto.length; i++) {
        await cloudinary.v2.uploader.destroy(arrPhoto[i].publicId)
    }
}

const addProduct = async (req,res,next) => {
    let arr = []
    const {
        productName,
        productPrice,
        productStock,
        productDesc
    }= req.body 
    for ( const {url : urlPhoto, public_id : publicId} of req.files ) {
        arr.push({urlPhoto,publicId})
    } 
    const product = await Product.create({
        productName,
        productPrice,
        productStock,
        productDesc,
        categoryId : req.params.categoryId,
        productphotos : arr
    },{include : [ProductPhoto]})
    response(res,true,product,'Product has been created',201)
}

const getAllProductsByCategory = async (req,res,next) => {
    const {categoryId} = req.params
    const products = await Product.findAll({
        include : [ProductPhoto],
        where : {categoryId}
    })
    response(res,true,products,'Products has been fetched',200)
}

const getAllProducts = async (req,res,next) => {
    const products = await Product.findAll({
        include : [ProductPhoto]
    })
    response(res,true,products,'Products has been fetched',200)
}

const updateProductInfo = async (req,res,next) => {
    const product = await Product.findByPk(req.params.productId)
    if(!product) return next(customError('product not found',400))
    const update = await product.update(req.body)
    response(res,true,update,'product data has been update',200)
}

const updateProductPhoto = async (req,res,next) => {
    // delete old photo
    const {files} = req
    const product  = await Product.findOne({
        include : [{
            model : ProductPhoto
        }],
        where : {id : req.params.productId}
    })
    if(!product) return next(customError('product not found',400))
    await deleteCloudinaryPhoto(product.productphotos)
    let arr = []
    for (let i = 0; i < files.length; i++) {
        let result = await ProductPhoto.create({
            urlPhoto : files[i].url,
            publicId : files[i].public_id
        })
        arr.push(result)
    }
    await product.setProductphotos(arr)
    response(res,true,arr,'Successfully update photo',200)
}

const deleteProduct = async (req,res,next) => {
    const product = await Product.findByPk(req.params.productId)
    if (!product) return next(customError('product not found',400))
    const productPhotos = await product.getProductphotos()
    await deleteCloudinaryPhoto(productPhotos)
    await product.destroy({force : true})
    response(res,true,{},'product has been deleted',200)
}

const getDetailProduct = async (req,res,next) => {
    const product = await Product.findOne({
        include : [
            {
                model : ProductPhoto
            },
            {
                model : Category,
                include : [{
                    model : Room,
                    as : 'rooms',
                    through : {
                        attributes : []
                    }
                }]
            }
        ],
        where : {id : req.params.productId}
    })
    if (!product) return next(customError('Product not found',400))
    response(res,true,product,'Product has been fetched',200)
}
module.exports = {
    addProduct,
    getAllProductsByCategory,
    getAllProducts,
    updateProductInfo,
    updateProductPhoto,
    deleteProduct,
    getDetailProduct
}