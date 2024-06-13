const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
const jwt=require('jsonwebtoken');
app.use(express.json());
app.use(cors());
require('dotenv').config();
const PORT=3000;


const secretKey="Se3c4r4e4tk4e0y";

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

const auth = (req, res, next) => {
  const jwtKey = req.headers.authorization;
  if (jwtKey) {
    
    jwt.verify(jwtKey, secretKey, (err, user) => {
      console.log(jwtKey)
      console.log(secretKey)
      if (err) {
        console.log(err)
        return res.sendStatus(403); // Unauthorized
      }
      req.user = user;
      next();
    });
  } else {
    return res.sendStatus(401); // Forbidden
  }
};

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
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({message:"User Created successfully",token})
}
})

app.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    const user=await User.findOne({username,password});
    if(user){
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
      res.status(200).json({message:"Logged in successfully",token});
    }
    else{
        res.status(404).json({message:"Wrong credentials"});
    }
})

app.get('/users',auth,async(req,res)=>{
    const Users=await User.find({});
    res.json({Users});
})

app.get('/users/:userId',auth,async(req,res)=>{
  let user=await User.findOne({_id:req.params.userId});
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