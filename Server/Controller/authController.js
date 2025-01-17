const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY || "Se3c4r4e4tk4e0y";
const saltRounds = 10;

exports.signup = async (req, res) => {
  const { username, password, email, name } = req.body;
  try {
    const socketId="000";
    const user = await User.findOne({ username });
    if (user) {
      res.status(403).json({ message: "Username already present" });
    } else {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new User({ username, hashedPassword, email, name,socketId });
      await newUser.save();
      res.cookie("user", username, { httpOnly: true, maxAge: 86400000 });
      res.json({ message: "User Created successfully" });
    }
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    const match = await bcrypt.compare(password, user.hashedPassword);
    if (match) {
      const token = jwt.sign({ username,user}, secretKey, { expiresIn: "1h" });
      res.cookie("token", token, { httpOnly: true, maxAge: 86400000 });
      res.status(200).json({ message: "Logged in successfully", token,authenticated:true });
    } else {
      res.status(404).json({ message: "Wrong credentials" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error",authenticated:false });
  }
};

exports.checkAuth=async(req,res)=>{
  const token = req.cookies.token;
  
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      
      res.json({ authenticated: true, user });
    });
  } else {
    res.json({ authenticated: false });
  }
}

exports.logout=async(req,res)=>{
  const token=req.cookies.token;
  console.log(token);
  if(token){
    await res.clearCookie('token');
    res.status(200).json("Logout successfully");
  }
}
