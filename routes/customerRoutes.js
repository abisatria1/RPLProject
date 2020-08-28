const router = require('express-promise-router')()
const customerController = require('../controllers/customerController')
const {validateBody,isUploadPhoto} = require('../helpers/validator/validateBody')
const validator= require('../helpers/validator/customerValidator')
const schema= require('../schemas/customerSchemas')
const passport = require('passport')
const authConfig = require('../helpers/auth')
const {upload} = require('../helpers/upload')

// passport
const passportGoogle = passport.authenticate('googleToken', {session : false ,failureRedirect : '/unauthorized'})
const passportJWT = passport.authenticate('jwt', {session : false , failureRedirect : '/unauthorized'})

router.route('/')
    // get all data customer
    .get(passportJWT, customerController.index)
    // register customer
    .post(
        [validateBody(schema.registerSchema), validator.validateRePassword() , validator.validateEmail()]
        ,customerController.register
    )

router.route('/login')
    // login customer
    .post(validateBody(schema.loginSchema) , customerController.login)

// google+ login
router.route('/login/google')
    .post(
        passportGoogle,
        customerController.loginGoogle
    )

router.route('/profile')
    // get data profile
    .get(passportJWT,customerController.getProfile)
    // update profile
    .patch(
        passportJWT,
        validateBody(schema.updateProfileSchema),
        customerController.updateProfile
    )

router.route('/profile/email')
    // update email
    .patch(
        passportJWT,
        validateBody(schema.updateEmailSchema),
        validator.validateEmail(),
        customerController.updateEmail
    )

router.route('/profile/password')
    // update password
    .patch(
        passportJWT,
        validateBody(schema.updatePasswordSchema),
        validator.validateOldPassword(),
        validator.validateRePassword(),
        customerController.updatePassword
    )
    // add password
    .post(
        passportJWT,
        validator.validateAddPassword(),
        validateBody(schema.addPasswordSchema),
        validator.validateRePassword(),
        customerController.addPassword
    )

router.route('/profile/photo')
    .patch(
        passportJWT,
        upload.single('photoProfile'), 
        isUploadPhoto(),
        customerController.updatePhoto
    )
    .delete(
        passportJWT,
        customerController.deletePhoto
    )

router.route('/information/order')
    .get(
        passportJWT,
        customerController.getAllOrder
    )

router.route('/information/payment/:orderId')
    .get(
        passportJWT,
        customerController.getPaymentInformation
    )

module.exports = router
