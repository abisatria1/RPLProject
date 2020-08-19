const router = require('express-promise-router')()
const categoryController = require('../controllers/categoryController')
const {validateBody,isUploadPhoto} = require('../helpers/validator/validateBody')
const schema = require('../schemas/categorySchemas')
const passport = require('passport')
const authConfig = require('../helpers/auth')

// passport
const passportJWT = passport.authenticate('jwt', {session : false , failureRedirect : '/unauthorized'})

// upload photo
const {uploadCategoryPhoto,upload} = require('../helpers/upload')

router.route('/')
    .get(
        categoryController.viewAllCategory
    )
    .post(
        uploadCategoryPhoto.array('categoryPhoto'),
        isUploadPhoto(),
        categoryController.createCategory
    )

router.route('/:categoryId')
    .get(
        categoryController.viewCategoryWithProduct
    )
    .patch(
        validateBody(schema.createCategorySchema),
        categoryController.updateCategoryInformation
    )
    .delete(
        categoryController.deleteCategory
    )

router.route('/photo/:categoryId')
    .patch(
        upload.array('categoryPhoto'),
        categoryController.updateCategoryPhoto
    )

module.exports = router