const Room = require('../models/room')
const Category = require('../models/category')
const {response,customError} = require('../helpers/wrapper')
const RoomPhoto = require('../models/roomPhoto')
const cloudinary = require('../config/cloudinary')

const deleteCloudinaryPhoto = async (arrPhoto) => {
    for (let i = 0; i < arrPhoto.length; i++) {
        await cloudinary.v2.uploader.destroy(arrPhoto[i].publicId)
    }
}

const viewAllRooms = async (req,res,next) => {
    const rooms = await Room.findAll({
        include : [{model : RoomPhoto}]
    })
    response(res,true,rooms,'All rooms data has been fetched',200)
}

const viewRoomWithCategory = async (req,res,next) => {
    const room = await Room.findOne({
        include : [
            {
                model : Category,
                through : {
                    attributes : ['createdAt']
                },
                as : 'categories'
            },
            {
                model : RoomPhoto
            }
        ],
        where : {id : req.params.roomId}
    })
    response(res,true,room,'Room has been fetched',200)

}

const createRoom = async (req,res,next) => {
    let arr = []
    const {roomDesc,roomName }= req.body 
    for ( const {url : urlPhoto, public_id : publicId} of req.files ) {
        arr.push({urlPhoto,publicId})
    } 
    const room = await Room.create({
        roomName,
        roomDesc,
        roomPhotos : arr
    },{include : [RoomPhoto]})
    response(res,true,room,'room has been created',201)
}

const updateRoomInformation = async (req,res,next) => {
    const room = await Room.findByPk(req.params.roomId)
    if(!room) return next(customError('Room not found',400))
    const update = await room.update(req.body)
    response(res,true,update,'Room data has been update',200)
}

const updateRoomPhoto = async (req,res,next) => {
    // delete old photo
    const {files} = req
    const room  = await Room.findOne({
        include : [{
            model : RoomPhoto
        }],
        where : {id : req.params.roomId}
    })
    if(!room) return next(customError('Room not found',400))
    await deleteCloudinaryPhoto(room.roomPhotos)
    let arr = []
    for (let i = 0; i < files.length; i++) {
        let result = await RoomPhoto.create({
            urlPhoto : files[i].url,
            publicId : files[i].public_id
        })
        arr.push(result)
    }
    await room.setRoomPhotos(arr)
    response(res,true,arr,'Successfully update photo',200)
}

const deleteRoom = async (req,res,next) => {
    const room = await Room.findByPk(req.params.roomId)
    const roomPhotos = await room.getRoomPhotos()
    await deleteCloudinaryPhoto(roomPhotos)
    await room.destroy()
    response(res,true,{},'Room has been deleted',200)
}

const addCategoryToRoom = async (req,res,next) => {
    // 
}


module.exports  = {
    viewAllRooms,
    viewRoomWithCategory,
    createRoom,
    updateRoomInformation,
    updateRoomPhoto,
    deleteRoom,
    addCategoryToRoom
}