import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";

function User() {
  const [user, setUser] = useState(null); // Initialize as null
  const { userId } = useParams(); // Get userId from route parameters
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [reciepient, setRecipient] = useState("");

  const socketio = io("http://localhost:3000", {
    withCredentials: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/${userId}`, { withCredentials: true });
       // console.log(response);
        setUser(response.data.user);
        setUsername(response.data.user.username);
        setRecipient(response.data.user._id); // Set recipient using user's _id
        socketio.emit("register", response.data.user.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [socketio,userId]);


  useEffect(() => {
    socketio.on("message", (newMessage) => {
      setMessages((prevMessage) => [...prevMessage, newMessage]);
    });

   
  }, []);

  useEffect(()=>{
    setRecipient(userId)
  },[userId])
  const SendMessage=()=>{
    if(message && reciepient){
      socketio.emit('message',{
        from:username,
        to:reciepient,
        message:message
      })
      setMessage('');
    }
  }
  return (
    <div>
      {user ? (
        <div>
          <h1>{user.username}</h1>

          {/* Add more user details as needed */}
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
      <button onClick={SendMessage}>Send</button>
      <div>
        <h2>
          {messages.map((msg, index) => {
            <div key={index}>{msg.message}</div>;
          })}
        </h2>
      </div>
    </div>
  );
}

export default User;
