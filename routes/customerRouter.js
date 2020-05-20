const router = require('express-promise-router')()
const customerController = require('../controllers/customerController')
const {validateBody} = require('../helpers/validator/validateBody')
const validator= require('../helpers/validator/customerValidator')
const schema= require('../schemas/customerSchema')
const passport = require('passport')
const authConfig = require('../helpers/auth')

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

module.exports = router
