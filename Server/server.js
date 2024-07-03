const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const jwt=require("jsonwebtoken");
const PORT = 3000;
const server = http.createServer(app);

const secretKey = "Se3c4r4e4tk4e0y";
require("dotenv").config();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  socketId: String,
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});
const messageSchema = new mongoose.Schema({
  from: String,
  to: String,
  message: String,
  timeStamp: { type: Date, default: Date.now() },
});

const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    server.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);
  socket.on("register", async (username) => {
    try {
      const user = await User.findOne({ username });
      if (user) {
        user.socketId = socket.id;
        await user.save();
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  });

  socket.on("message", async ({ from, to, message }) => {
    try {
      const newMessage = new Message({ from, to, message });
      await newMessage.save();
    
      const recipient = await User.findOne({ username: to });
      const user=await User.findOne({username:from});
      console.log(user);
      user.messages.push(newMessage);
      
      await user.save();
      if (recipient && recipient.socketId) {
        io.to(recipient.socketId).emit("message", newMessage);

      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    req.user = token;
    next();
  } else {
    return res.sendStatus(401); // Forbidden
  }
};


app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      res.status(403).json({ message: "Username already present" });
    } else {
      const newUser = new User({ username, password });
      await newUser.save();
      res.cookie("user", username, { httpOnly: true, maxAge: 86400000 });
      res.json({ message: "User Created successfully" });
    }
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
      res.cookie("token", token, { httpOnly: true, maxAge: 86400000 });
      res.status(200).json({ message: "Logged in successfully",token });
    } else {
      res.status(404).json({ message: "Wrong credentials" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({});
    //console.log(users);
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/users/:userId", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    console.log(user);
    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
