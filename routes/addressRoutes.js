const router = require('express-promise-router')()
const addressController = require('../controllers/addressController')
const {validateBody} = require('../helpers/validator/validateBody')
const schema= require('../schemas/addressSchemas')
const passport = require('passport')
const authConfig = require('../helpers/auth')

// passport
const passportJWT = passport.authenticate('jwt', {session : false , failureRedirect : '/unauthorized'})

router.route('/')
    .get(
        passportJWT,
        addressController.viewAddress
    )
    .post(
        passportJWT,
        validateBody(schema.addAddress),
        addressController.addAddress
    )

router.route('/:addressId')
    .patch(
        passportJWT,
        validateBody(schema.addAddress),
        addressController.updateAddress
    )
    .delete (
        passportJWT,
        addressController.deleteAddress
    )

module.exports = router