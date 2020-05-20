const multer = require('multer')
const cloudinary = require('../config/cloudinary')
const cloudinaryStorage = require('multer-storage-cloudinary')

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'RplProject',
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

const upload = multer({
    storage,
    limits : {
        fileSize : 1024 * 1024 * 5
        // 5mb
    },
    fileFilter
})

module.exports = upload