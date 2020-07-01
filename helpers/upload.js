const multer = require('multer')
const cloudinary = require('../config/cloudinary')
const cloudinaryStorage = require('multer-storage-cloudinary')

// schema for validation
const roomSchemas = require('../schemas/roomSchemas')
const Joi = require('joi')

// validation body
const validateBody = (req,schema,cb) => {
    const result = Joi.validate(req.body,schema,{abortEarly : false})
    if (result.error) {
        let errorData = []
        result.error.details.map(item => {
            let error = {
                path : item.path[0],
                message : item.message
            }
            errorData.push(error)
        })
        let err = new Error('Validation failed')
        err.status = 422
        err.data = errorData
        return cb(err,false)
    }
    return cb(null,true)
}

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: (req, file, cb) => {
        let folderName = 'RplProject/'
        switch (file.fieldname) {
            case 'photoProfile':
                folderName += "customer"
                break;
            case 'categoryPhoto' : 
                folderName += "category"
                break;
            case 'roomPhoto' : 
                folderName += "room"
                break;
            case 'productPhoto' : 
                folderName += "product"
                break;
            default:
                break;
        }
        cb(null,folderName)
    },
    allowedFormats: ['jpg', 'png' , 'jpeg' , 'gif'],
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})

const fileFilter = (req,file,cb) => {
    if (file.mimetype === 'image/jpeg' ||file.mimetype === 'image/jpg' ||file.mimetype === 'image/gif' || file.mimetype === 'image/png') {
        cb(null,true)
    }else {
        const err = new Error('File extension doesnt match')
        err.status = 422 
        cb(err, false)
    }
}

const fileFilterForRooms  = (req,file,cb) => {
    console.log(file)
    if (file.mimetype === 'image/jpeg' ||file.mimetype === 'image/jpg' ||file.mimetype === 'image/gif' || file.mimetype === 'image/png') {
        validateBody(req,roomSchemas.createRoomSchema,cb)
    }else {
        err = new Error('File extension doesnt match')
        err.status = 422 
        cb(err, false)
    }
}

const upload = multer({
    storage,
    limits : {
        fileSize : 1024 * 1024 * 5 // 5mb
    },
    fileFilter
})

const uploadRoomPhoto = multer({
    storage,
    limits : {
        fileSize : 1024 * 1024 * 5 // 5mb
    },
    fileFilter : fileFilterForRooms
})

module.exports = {
    upload,
    uploadRoomPhoto
}