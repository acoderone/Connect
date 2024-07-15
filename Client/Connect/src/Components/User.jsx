import  { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ['websocket'], // Ensure WebSocket transport is used
  autoConnect: true,
});

function User() {
  const navigate=useNavigate();
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [sender, setSender] = useState("");

  useEffect(() => {
    socket.connect(); // Connect the socket

    const token = localStorage.getItem("token");
    if(!token){
      navigate('/login');
      return;
    }

    else if (token) {
      const decodedToken = jwtDecode(token);
      setSender(decodedToken.username);
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/users/${userId}`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setUser(response.data.user);
        setUsername(response.data.user.username);
        setMessages(response.data.user.messages); // Fetch initial messages
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchMessages = async () => {
      const response2 = await axios.get(
        `http://localhost:3000/messages/${userId}`,
        { withCredentials: true }
      );
      console.log(response2);
      setMessages(response2.data.messages);
    };

    fetchData();
    fetchMessages();

    socket.on("msg", (messageData) => {
      console.log("New message received:", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off("msg");
      socket.disconnect(); // Clean up the socket connection
    };
  }, [userId]);

  useEffect(() => {
    if (sender) {
      socket.emit("register", sender); // Emit register event when sender is set
    }
  }, [sender]);

  const sendMessage = () => {
    if (message && username) {
      const messageData = {
        from: sender,
        to: username,
        message: message,
      };
      console.log(messageData.from, messageData.to, messageData.message);
      socket.emit("message", messageData); // Emit message event
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage("");
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>{username}</h1>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        <h2>Messages</h2>
        {messages.map((msg, index) => (
          <div key={index}>{msg.message}</div>
        ))}
      </div>
    </div>
  );
}

export default User;
