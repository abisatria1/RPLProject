const router = require('express-promise-router')()
const productController = require('../controllers/productController')
const {validateBody,isUploadPhoto} = require('../helpers/validator/validateBody')
const schema = require('../schemas/productSchemas')

const passport = require('passport')
const authConfig = require('../helpers/auth')

// passport
const passportJWT = passport.authenticate('jwt', {session : false , failureRedirect : '/unauthorized'})

// upload photo
const {uploadProductPhoto,upload} = require('../helpers/upload')

router.route('/')
    .get(
        productController.getAllProducts
    )

router.route('/:categoryId')
    .get(
        productController.getAllProductsByCategory
    )
    .post(
        uploadProductPhoto.array('productPhoto'),
        validateBody(schema.createProductSchema),
        isUploadPhoto(),
        productController.addProduct
    )

router.route('/detail/:productId')   
    .get(
        productController.getDetailProduct
    )
    .patch(
        validateBody(schema.createProductSchema),
        productController.updateProductInfo
    )
    .delete(
        productController.deleteProduct
    )

router.route('/photo/:productId')
    .patch(
        upload.array('productPhoto'),
        productController.updateProductPhoto
    )

module.exports = router