const router = require('express-promise-router')()
const roomController = require('../controllers/roomController')
const {validateBody,isUploadPhoto} = require('../helpers/validator/validateBody')
const schema = require('../schemas/roomSchemas')
const passport = require('passport')
const authConfig = require('../helpers/auth')

// passport
const passportJWT = passport.authenticate('jwt', {session : false , failureRedirect : '/unauthorized'})

// upload photo
const {uploadRoomPhoto,upload} = require('../helpers/upload')

router.route('/')
    .get(
        passportJWT,
        roomController.viewAllRooms
    )
    .post(
        uploadRoomPhoto.array('roomPhoto'),
        isUploadPhoto(),
        roomController.createRoom
    )

router.route('/:roomId')
    .get(
        passportJWT,
        roomController.viewRoomWithCategory
    )
    .patch(
        validateBody(schema.createRoomSchema),
        roomController.updateRoomInformation
    )
    .delete(
        roomController.deleteRoom
    )

router.route('/photo/:roomId')
    .patch(
        upload.array('roomPhoto'),
        roomController.updateRoomPhoto
    )

module.exports = router