const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  hashedPassword: String,
  email: String,
  name: String,
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  socketid:{type:String,default:null},
});

module.exports = mongoose.model("User", userSchema);
