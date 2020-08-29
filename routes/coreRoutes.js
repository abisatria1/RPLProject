const router = require('express-promise-router')()
const coreController = require('../controllers/coreController')
const {validateBody,isUploadPhoto} = require('../helpers/validator/validateBody')
const validator= require('../helpers/validator/coreValidator')
const schema= require('../schemas/coreSchemas')

// auth
const passport = require('passport')
const authConfig = require('../helpers/auth')
const { countTotalPrice } = require('../helpers/validator/coreValidator')

// passport
const passportGoogle = passport.authenticate('googleToken', {session : false ,failureRedirect : '/unauthorized'})
const passportJWT = passport.authenticate('jwt', {session : false , failureRedirect : '/unauthorized'})

// cart
router.route('/cart')
    .get(
        passportJWT,
        coreController.getCartItems
    )
    .post(
        passportJWT,
        validateBody(schema.addItemsToCartSchema),
        validator.validateProductAddToCart(),
        validator.findItemInCartByProductId(),
        coreController.addItemsToCart
    )

router.route('/cart/delete')
    .delete(
        passportJWT,
        coreController.deleteAllCartItems
    )

router.route('/cart/:cartId')
    .patch(
        passportJWT,
        validateBody(schema.updateCartItem),
        coreController.updateCartItem
    )
    .delete(
        passportJWT,
        coreController.deleteCartItems
    )

// order
router.route('/paymentMethod')
    .get(
        passportJWT,
        coreController.getPaymentMethod
    )

router.route('/confirmOrder')
    .post(
        passportJWT,
        validateBody(schema.confirmOrder),
        validator.countTotalPrice(),
        coreController.confirmOrder
    )

router.route('/cancelOrder/:orderId')
    .post(
        passportJWT,
        coreController.cancelOrder
    )

router.route('/status/order/:orderId')
    .post(
        coreController.updateOrderStatus
    )

router.route('/status/payment/:orderId')
    .post(
        coreController.verifyPayment
    )


module.exports = router