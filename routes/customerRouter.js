const router = require('express-promise-router')()
const customerController = require('../controllers/customerController')
const {validateBody,isUploadPhoto} = require('../helpers/validator/validateBody')
const validator= require('../helpers/validator/customerValidator')
const schema= require('../schemas/customerSchema')
const passport = require('passport')
const authConfig = require('../helpers/auth')
const upload = require('../helpers/upload')

router.route('/')
    // get all data customer
    .get(passport.authenticate('jwt', {session : false}), customerController.index)
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
    .get(
        passport.authenticate('google',{scope : ['profile' , 'email'] , session : false})
    )

router.route('/login/google/callback')
    .get(
        passport.authenticate('google' , {session : false}),
        customerController.loginGoogle
    )

router.route('/profile')
    // get data profile
    .get(passport.authenticate('jwt', {session : false}),customerController.getProfile)
    // update profile
    .patch(
        passport.authenticate('jwt', {session : false}),
        validateBody(schema.updateProfileSchema),
        customerController.updateProfile
    )

router.route('/profile/email')
    // update email
    .patch(
        passport.authenticate('jwt', {session : false}),
        validateBody(schema.updateEmailSchema),
        validator.validateEmail(),
        customerController.updateEmail
    )

router.route('/profile/password')
    // update password
    .patch(
        passport.authenticate('jwt', {session : false}),
        validateBody(schema.updatePasswordSchema),
        validator.validateOldPassword(),
        validator.validateRePassword(),
        customerController.updatePassword
    )
    // add password
    .post(
        passport.authenticate('jwt', {session : false}),
        validator.validateAddPassword(),
        validateBody(schema.addPasswordSchema),
        validator.validateRePassword(),
        customerController.addPassword
    )

router.route('/profile/photo')
    .patch(
        passport.authenticate('jwt', {session : false}),
        upload.single('photoProfile'), 
        validateBody(schema.updatePhotoSchema),
        isUploadPhoto(),
        customerController.updatePhoto
    )
    .delete(
        passport.authenticate('jwt', {session : false}),
        customerController.deletePhoto
    )

module.exports = router
