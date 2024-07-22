const mongoose =require('mongoose');

const roomSchema=new mongoose.Schema({
    roomId:String,
    users:[{type:mongoose.Schema.Types.ObjectId}],
    passKey:String,
    messages:[{type:mongoose.Schema.Types.ObjectId,ref:"Room_Message"}],
    
})

module.exports=mongoose.model("room",roomSchema);