const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from: String,
  roomId: String,
  message: String,
  timeStamp: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Room_Message", messageSchema);
 