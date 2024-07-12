const User = require("../models/user");
const Message = require("../models/message");

exports.getMessages = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
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
