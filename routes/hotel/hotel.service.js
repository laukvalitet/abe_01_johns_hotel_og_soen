const Hotel = require("../../models/hotel");
const { HttpError } = require("../../middleware/errorHandler");

const getHotels = async () => {
  return Hotel.find({});
};

const getHotel = async (hotelName) => {
  const hotel = await Hotel.findOne({ name: hotelName });
  if (!hotel) {
    throw new HttpError(400, `Hotel ${hotelName} does not exist.`);
  } else {
    return hotel;
  }
};

const addRoom = async (hotelName, roomNumber, numberOfBeds, verifiedUser) => {
  const hotel = await getHotel(hotelName);
  if (verifiedUser._id == hotel.owner) {
    const room = {
      roomNumber: roomNumber,
      numberOfBeds: numberOfBeds,
      isOccupied: false,
    };
    hotel.rooms.push(room);
    try {
      return await hotel.save();
    } catch (error) {
      throw new HttpError(400, "Roomnumber already exists.");
    }
  } else {
    throw new HttpError(403, "Access denied.");
  }
};

const addHotel = async (
  hotelName,
  streetName,
  houseNumber,
  zip,
  verifiedUser
) => {
  const hotel = new Hotel({
    name: hotelName,
    streetName,
    houseNumber,
    zip,
    rooms: [],
    owner: verifiedUser._id,
  });
  try {
    return await hotel.save();
  } catch (error) {
    throw new HttpError(400, "Hotel already exists");
  }
};

async function getVacantRooms(hotelName) {
  const hotel = await getHotel(hotelName);
  return hotel.rooms
    .filter((room) => !room.isOccupied)
    .map((room) => {
      return {
        roomNumber: room.roomNumber,
        numberOfBeds: room.numberOfBeds,
        isOccupied: room.isOccupied,
      };
    });
}

async function getRoomByRoomNumber(hotelName, roomNumber) {
  const hotel = await getHotel(hotelName);
  let room = hotel.rooms.find((room) => room.roomNumber == roomNumber);
  if (!room) {
    throw new HttpError(400, "Room does not exist.");
  }
  return {
    roomNumber: room.roomNumber,
    numberOfBeds: room.numberOfBeds,
    isOccupied: room.isOccupied,
  };
}

async function updateRoom(hotelName, updatedRoom, roomNumber) {
  const hotel = await getHotel(hotelName);
  let room = hotel.rooms.find((room) => room.roomNumber == roomNumber);
  if (!room) {
    throw new HttpError(400, "Room does not exist.");
  }
  room.isOccupied = updatedRoom.isOccupied;
  room.numberOfBeds = updatedRoom.numberOfBeds;
  try {
    roomAfterSave = await hotel.save();
    return {
      roomNumber: room.roomNumber,
      numberOfBeds: room.numberOfBeds,
      isOccupied: room.isOccupied,
    };
  } catch (error) {
    throw new HttpError(
      400,
      `Couldn't save room ${roomNumber} in ${hotelName}`
    );
  }
}

module.exports = {
  getHotels,
  getHotel,
  addHotel,
  addRoom,
  getVacantRooms,
  getRoomByRoomNumber,
  updateRoom,
};
