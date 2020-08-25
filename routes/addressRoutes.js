const router = require('express-promise-router')()
const addressController = require('../controllers/userAddressController')
const {validateBody} = require('../helpers/validator/validateBody')
const validator = require('../helpers/validator/addressValidator')
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
        validator.fillProvinceData(),
        addressController.addAddress
    )

router.route('/:addressId')
    .get(
        passportJWT,
        addressController.getDetailAddress
    )
    .patch(
        passportJWT,
        validateBody(schema.addAddress),
        validator.fillProvinceData(),
        addressController.updateAddress
    )
    .delete (
        passportJWT,
        addressController.deleteAddress
    )

module.exports = router