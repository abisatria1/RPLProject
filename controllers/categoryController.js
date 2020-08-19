const {response,customError} = require('../helpers/wrapper')
const cloudinary = require('../config/cloudinary')

// model
const Room = require('../models/room')
const RoomPhoto = require('../models/roomPhoto')
const Category = require('../models/category')
const CategoryPhoto = require('../models/categoryPhoto')
const Product = require('../models/product')
const ProductPhoto = require('../models/productPhoto')

const deleteCloudinaryPhoto = async (arrPhoto) => {
    for (let i = 0; i < arrPhoto.length; i++) {
        await cloudinary.v2.uploader.destroy(arrPhoto[i].publicId)
    }
}

const viewAllCategory = async (req,res,next) => {
    const category = await Category.findAll({
        include : [{model : CategoryPhoto},{model : Room, as : 'rooms'}]
    })
    response(res,true,category,'All categories data has been fetched',200)
}

const viewCategoryWithProduct = async (req,res,next) => {
    const category = await Category.findOne({
        include : [
            {
                model : Product,
                attributes : {exclude : ['updatedAt','deletedAt']},
                include : [{
                    model : ProductPhoto,
                    attributes : {exclude : ['updatedAt','deletedAt']},
                }]
            },
            {
                model : CategoryPhoto
            }
        ],
        where : {id : req.params.categoryId}
    })
    response(res,true,category,'category has been fetched',200)
}

// create category with room id
const createCategory = async (req,res,next) => {
    const {roomId} = req.query
    // validasi query
    let arr = []
    const {categoryName,categoryDesc }= req.body 
    for ( const {url : urlPhoto, public_id : publicId} of req.files ) {
        arr.push({urlPhoto,publicId})
    } 
    const category = await Category.create({
        categoryName,
        categoryDesc,
        categoryphotos : arr
    },{include : [CategoryPhoto]})
    const relation = await category.addRoom(parseInt(roomId))
    response(res,true,{category,relation},'category has been created',201)
}

const updateCategoryInformation = async (req,res,next) => {
    const category = await Category.findByPk(req.params.categoryId)
    if(!category) return next(customError('category not found',400))
    const update = await category.update(req.body)
    response(res,true,update,'category data has been update',200)
}

const updateCategoryPhoto = async (req,res,next) => {
    // delete old photo
    const {files} = req
    const category  = await Category.findOne({
        include : [{
            model : CategoryPhoto
        }],
        where : {id : req.params.categoryId}
    })
    if(!category) return next(customError('category not found',400))
    await deleteCloudinaryPhoto(category.categoryphotos)
    let arr = []
    for (let i = 0; i < files.length; i++) {
        let result = await CategoryPhoto.create({
            urlPhoto : files[i].url,
            publicId : files[i].public_id
        })
        arr.push(result)
    }
    await category.setCategoryphotos(arr)
    response(res,true,arr,'Successfully update photo',200)
}

const deleteCategory = async (req,res,next) => {
    const category = await Category.findByPk(req.params.categoryId)
    if (!category) return next(customError('category not found',400))
    const categoryPhotos = await category.getCategoryphotos()
    await deleteCloudinaryPhoto(categoryPhotos)
    await category.destroy({force : true})
    response(res,true,{},'category has been deleted',200)
}


module.exports  = {
    viewAllCategory,
    viewCategoryWithProduct,
    createCategory,
    updateCategoryInformation,
    updateCategoryPhoto,
    deleteCategory,
}