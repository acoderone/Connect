const User = require("../models/user");
const Message = require("../models/message");
const room = require("../models/room");
const room_message = require("../models/room_message");
const mongoose = require("mongoose");
exports.getMessages = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const messages = await Message.find({
      $or: [
        {
          $and: [{ to: user.username }, { from: req.user.username }],
        },
        {
          $and: [{ to: req.user.username }, { from: user.username }],
        },
      ],
    }).sort({ timeStamp: 1 });
    res.send({ messages });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createRoom = async (req, res) => {
  const { roomId,passkey } = req.body;
  const getRoomId = await room.findOne({ roomId: roomId });
  if (getRoomId) {
    console.error("Id not available");
  } else {
    try {
      const Room = new room({ roomId,passkey });
      await Room.save();
      res.status(200).send("Room created succesfully");
    } catch (e) {
      console.error(e);
    }
  }
};

exports.getRoom = async (req, res) => {
  const roomId = req.params.roomId;
  const current_room = room.findOne(roomId);
  if (current_room) {
    console.log("room available");
    res.status(400).json({ message: "Room not available" });
  } else {
    res.status(200).json({ message: "Room available" });
    //console.error("room not available");
  }
};

exports.enterRoom = async (req, res) => {
  const { roomId,passkey } = req.body;
 // console.log("RoomId id", roomId);
  const current_room =await room.findOne({ roomId: roomId,passkey:passkey });
  if (current_room) {
    console.log("room available");
    res.status(200).json({ message: "Entered in the room" });
  } else {
    res.status(404).json({ message: "Room not found" });
    //console.error("room not available");
  }
};
exports.getRoomMessages = async (req, res) => {
  const roomId = req.params.roomId;
  console.log(roomId);
  const messages = await room_message.find({
    roomId,
  });
  if (messages) {
    //console.log(messages);
    res.json(messages);
  } else {
    res.json("Inbox empty");
  }
};
