import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";

import {jwtDecode} from 'jwt-decode';
const socket = io("http://localhost:3000", {
  withCredentials: true,
});
//const usernameFromCookie = Cookies.get('user');
function User() {
  const [user, setUser] = useState(null); // Initialize as null
  const { userId } = useParams(); // Get userId from route parameters
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [sender,setSender]=useState("");
  useEffect(() => {
    // Read username from cookies
    socket.connect();
    const token = localStorage.getItem('token'); // Adjust this based on how you store your token
    //console.log(token);
    if (token) {
      const decodedToken = jwtDecode(token);
      setSender(decodedToken.username);
    }
    //console.log(usernameFromCookie);

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/${userId}`, { withCredentials: true });
        
        setUser(response.data.user);
        setUsername(response.data.user.username);
        socket.emit("register", response.data.user._id);
        setMessages(response.data.user.messages);
        console.log(messages);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();

    // Listen for incoming messages
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("message");
      socket.disconnect();
    };
  }, [userId]);

  useEffect(()=>{
    const fetchData=async()=>{
      const response2=await axios.get(`http://localhost:3000/messages/${userId}`,{withCredentials:true});
    console.log(response2);
    setMessages(response2.data.messages)
    }
   fetchData();
  },[])
  const sendMessage = () => {
    if (message && username) {
      socket.emit('message', {
        from: sender,
        to: username,
        message: message
      });
      setMessage('');
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
