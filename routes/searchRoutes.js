const router = require('express-promise-router')()
const searchController = require('../controllers/searchController')

router.route('/product/:key')
    .get(searchController.searchProduct)

router.route('/newItems/product')
    .get(searchController.newProductRecommendation)

router.route('/recommendation/product')
    .get(searchController.productRecommendation)

router.route('/similar/product/:productId')
    .get(searchController.similarProductRecommendatiion)

module.exports = router