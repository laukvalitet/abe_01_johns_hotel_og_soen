const { HttpError } = require("../../middleware/errorHandler");
const hotelService = require('./hotel.service')

const getHotels = (req, res, next) => {
    hotelService
        .getHotels()
        .then((hotels) => res.status(200).json(hotels))
        .catch((error) => next(error))
}

const addHotel = (req, res, next) => {
    const {hotelName, streetName, houseNumber, zip} = req.body;
    if(!hotelName || !streetName || !houseNumber || !zip) {
        throw new HttpError(400, "hotelName, streetName, houseNumber or zip missing")
    }
    hotelService
        .addHotel(hotelName, streetName, houseNumber, zip)
        .then((hotel) => res.status(201).send(hotel))
        .catch((error) => next(error))
}

const getHotel = (req, res, next) => {
    const {name} = req.param;
    hotelService
        .getHotel(name)
        .then((hotel) => res.status(200).send(hotel))
        .catch((error) => next(error))
}

const getVacantRooms = (req, res, next) => {
    const hotelName = req.param;
    hotelService.getVacantRooms(hotelName)
        .then((rooms)=>res.status(200).send(rooms))
        .catch((error)=>next(error))
}

const getRoomByRoomNumber = (req, res, next) => {
    const hotelName = req.body.hotelName;
    const roomNumber = req.body.roomNumber;
    hotelService.getRoomByRoomNumber(hotelName,roomNumber)
        .then((room)=>res.status(200).send(room))
        .catch((error)=>next(error))
}

const createRoom = (req, res, next) => {
    const hotelName = req.body.hotelName;
    const room = req.body.room;
    hotelService.createRoom(hotelName,room)
        .then((room)=>res.status(201).send(room))
        .catch((error)=>next(error))
}

const markRoomAsVacant = (req, res, next) => {
    const hotelName = req.body.hotelName;
    const roomNumber = req.body.roomNumber;
    hotelService.markRoomAsVacant(hotelName,roomNumber)
        .then((room)=>res.status(200).send(room))
        .catch((error)=>next(error))
}

const markRoomAsOccupied = (req, res, next) => {
    const hotelName = req.body.hotelName;
    const roomNumber = req.body.roomNumber;
    hotelService.markRoomAsOccupied(hotelName, roomNumber)
        .then((room)=>res.status(200).send(room))
        .catch((error)=>next(error))
}




module.exports = {
    getHotels,
    getHotel,
    addHotel,
    getVacantRooms,
    getRoomByRoomNumber,
    createRoom,
    markRoomAsVacant,
    markRoomAsOccupied,
}