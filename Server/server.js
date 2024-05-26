const express=require('express');
const app=express();
const mongoose=require('mongoose');
app.use(express.json());
require('dotenv').config();
const PORT=3000;



const userSchema=new mongoose.Schema({
    username:String,
    password:String,
    messages:[{type:mongoose.Schema.Types.ObjectId,ref:'Message'}]
})

const messageSchema=new mongoose.Schema({
    message:String
});

const User=mongoose.model("User",userSchema);
const Message=mongoose.model("message",messageSchema);

mongoose.connect(process.env.MONGODB_URI)

app.post('/signup',async(req,res)=>{
const{username,password}=req.body;
const user=await User.findOne({username});
if(user){
    res.status(403).json({message:"Username already present"});
}
else{
    const obj={username:username,password:password};
    const newUser=new User(obj);
    await newUser.save();
    res.json({message:"User Created successfully"})
}
})

app.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    const user=User.findOne({username,password});
    if(user){
      res.status(200).json({message:"Logged in successfully"});
    }
    else{
        res.status(404).json({message:"Wrong credentials"});
    }
})

app.get('/users',async(req,res)=>{
    const Users=await User.find({});
    res.json({Users});
})

app.get('/users/:userId',async(req,res)=>{
  const user=await User.findOne({_id:req.params.userId});
  if(user){
    res.json({user});
  }
  else{
    res.status(404).send({message:"User not found"});
  }
})

app.listen(PORT,()=>{
    console.log(`Server is running on`, PORT);
})