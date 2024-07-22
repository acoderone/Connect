import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket"], // Ensure WebSocket transport is used
  autoConnect: true,
});

function User({ selectedUser }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [sender, setSender] = useState("");

  useEffect(() => {
    socket.connect(); // Connect the socket

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    } else if (token) {
      const decodedToken = jwtDecode(token);
      setSender(decodedToken.username);
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/users/${selectedUser._id}`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setUser(response.data.user);
        setUsername(response.data.user.username);
        setMessages(response.data.user.messages);
        console.log(username); // Fetch initial messages
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchMessages = async () => {
      const response2 = await axios.get(
        `http://localhost:3000/messages/${selectedUser._id}`,
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
  }, [navigate, selectedUser._id, userId, username]);

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
    <div className="flex flex-col w-3/4 gap-3  ">
      <div>
        {user ? (
          <div>
            <h1>{username}</h1>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

      <div className="flex rounded-md  bg-slate-400 flex-col h-3/4 overflow-y-auto gap-2 px-2 py-3">
        {messages.map((msg, index) =>
          msg.from == sender ? (
            <div className="flex justify-end gap-2" key={index}>
              <div className="flex rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl p-2 bg-lime-400 w-1/3">
                {msg.message}
               
              </div>
             
            </div>
          ) : (
            <div className="" key={index}>
              <div className="rounded-tl-2xl rounded-tr-2xl rounded-br-2xl p-2 bg-slate-200 w-1/3">
                {msg.message}
              </div>
              
            </div>
          )
          
        )
        }
      </div>
      <div className="flex gap-1 justify-center">
        <input
          className="w-3/4 "
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
User.propTypes = {
  selectedUser: PropTypes.object, // Define the expected type for selectedUser
};
export default User;
