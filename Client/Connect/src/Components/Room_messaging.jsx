import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { useRef } from "react";

import mySound from "../assets/happy-pop-2-185287.mp3";
const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket"], // Ensure WebSocket transport is used
  autoConnect: true,
});

function Room() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState("");
  const MessageRef = useRef(null);
  const [playsound] = useSound(mySound);
  useEffect(() => {
    socket.connect();
    socket.emit("join room", roomId);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    } else if (token) {
      const decodedToken = jwtDecode(token);
      setSender(decodedToken.username);
    }
    const fetchRoomMessages = async () => {
      try {
        console.log(roomId);
        const response = await axios.get(
          `http://localhost:3000/messages/roomMessages/${roomId}`,
          { withCredentials: true }
        );
        console.log(response.data);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching room messages:", error);
      }
      scrollToBottom();
    };

    fetchRoomMessages();

    // Listen for incoming messages
    socket.on("recieve_message", (messageData) => {
      playsound();
      console.log("New message received:", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off("recieve_message");
      socket.disconnect(); // Clean up the socket connection
    };
  }, [navigate, roomId]);

  const handleLeaveRoom = () => {
    if (roomId != "") {
      socket.emit("leave_room", roomId);
      navigate("/");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    const messageData = {
      from: sender,
      roomId: roomId,
      message: message,
    };
    socket.emit("room_message", messageData);

    setMessage(""); // Clear the input field
  };
  const scrollToBottom = () => {
    if (MessageRef.current) {
      MessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="flex flex-col justify-center items-center  w-full h-full">
      <h1 className="text-3xl font-bold p-1">{roomId}</h1>
      <div className="flex justify-center items-center flex-col rounded-md bg-slate-200  w-11/12 h-5/6  ">
        <div className="flex flex-col items-center w-full h-11/12 flex-grow">
          <div className="flex flex-col  w-2/3 p-3 gap-2">
            {messages.map((msg, index) =>
              msg.from === sender ? (
                <div
                  ref={MessageRef}
                  className="flex justify-end gap-2"
                  key={index}
                >
                  <div className="inline-block max-w-xs rounded-2xl p-2 bg-blue-400">
                    {msg.message}
                  </div>
                </div>
              ) : (
                <div
                  ref={MessageRef}
                  className="justify-start gap-2"
                  key={index}
                >
                  <div className="inline-block max-w-xs rounded-2xl p-2 bg-white ">
                    {msg.message}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div className="flex gap-1 justify-center p-2">
          <input
            placeholder="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow border rounded-full h-8 p-2 px-3 text-md border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue"
          />
          <button
            className="bg-blue-500 text-white rounded-full px-4"
            onClick={sendMessage}
          >
            Send
          </button>
          <button
            className="bg-blue-500 text-white rounded-full px-4"
            onClick={handleLeaveRoom}
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Room;
