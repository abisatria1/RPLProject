const router = require('express-promise-router')()
const ongkirController = require('../controllers/ongkirController')
const {validateBody,isUploadPhoto} = require('../helpers/validator/validateBody')
const schema = require('../schemas/ongkirSchemas')

router.route('/province')
    .get(
        ongkirController.getProvince
    )

router.route('/city')
    .get(
        ongkirController.getCity
    )

router.route('/search/city')
    .get(
        ongkirController.searchCity
    )

router.route('/search/province')
    .get(
        ongkirController.searchProvince
    )

router.route('/courierFee')
    .post(
        validateBody(schema.courierFeeSchema),
        ongkirController.courierFee
    )

module.exports = router