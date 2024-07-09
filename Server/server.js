const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { timeStamp } = require("console");
const PORT = 3000;
const server = http.createServer(app);
const users = {};
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
      console.log("username", username);
      const user = await User.findOne({ username });
      if (user) {
        console.log("Hii");
        users[username] = socket.id;
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  });

  socket.on("message", async (messageData) => {
    try {
      let receiver = users[messageData.to];
      let sender=users[messageData.from];
      console.log("receiver", receiver, users);
      if (receiver && sender) {
        io.to(receiver).emit("msg", messageData);
      

      const newMessage = new Message(messageData);
      await newMessage.save();

      const senderUser = await User.findOne({ username: sender });
      const recipientUser = await User.findOne({ username: reciever });

      if (senderUser && recipientUser) {
        senderUser.messages.push(newMessage);
        recipientUser.messages.push(newMessage);
        await senderUser.save();
        await recipientUser.save();
      }
    }
      socket.on('disconnect', () => {
        console.log('A user disconnected: ' + socket.id);
        for (const [username, socketId] of Object.entries(users)) {
          if (username === username) {
            delete users[username];
            break;
          }
        }
      });
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
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      } else {
        req.user = decoded; // Attach the decoded token payload to the req object
        next();
      }
    });
  } else {
    return res.sendStatus(401); // Unauthorized
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
      const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
      res.cookie("token", token, { httpOnly: true, maxAge: 86400000 });
      res.status(200).json({ message: "Logged in successfully", token });
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
    //console.log(user);
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

app.get("/messages/:userId", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    //console.log("USer is",user);
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
    console.log(req.user.username);
    res.send({ messages });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});