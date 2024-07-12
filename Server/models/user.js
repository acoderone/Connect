const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  hashedPassword: String,
  email: String,
  name: String,
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

module.exports = mongoose.model("User", userSchema);
