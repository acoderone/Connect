const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const { timeStamp } = require("console");
const PORT = 3000;
const server = http.createServer(app);
const users = {};
const User=require("./models/user");
const Message=require("./models/message");
const Room_message=require("./models/room_message");
const Room=require("./models/room");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes"); 
//const room = require("./models/room");

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
      let sender = users[messageData.from];
      console.log("receiver", receiver, users);
      if (receiver && sender) {
        io.to(receiver).emit("msg", messageData);

        const newMessage = new Message(messageData);
        await newMessage.save();

        const senderUser = await User.findOne({ username: messageData.from });
        const recipientUser = await User.findOne({ username: messageData.to });

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
  
  socket.on('join room',(room)=>{
    socket.join(room);
    console.log(`User has joined the room ${room}`);
  })

  socket.on('room_message', async ( messageData) => {
    try {
     const selected_room=await Room.findOne({roomId:messageData.roomId});
     if(selected_room){
      console.log(selected_room);
      const current_message=new Room_message({roomId:messageData.roomId,message:messageData.message});
      await current_message.save();
      console.log(current_message);
      selected_room.messages.push(current_message);
     }
       
    } catch (error) {
      console.error("Error handling room message:", error);
    }
  });
  
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
