const User = require("../models/user");
const Message = require("../models/message");
const room=require("../models/room");

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

exports.createRoom=async(req,res)=>{
  const{roomId,password,newPassword}=req.body;
  const getRoomId=await room.findOne({roomId:roomId});
  if(getRoomId){
    console.error("Id not available");
  }
  else{
    if(password===newPassword){
      const room=new room({roomId,password});
      res.status(200).send("Room created succesfully");
    }
    else{
      res.status(400).send("Password not matching");
    }
  
  }
  
}
