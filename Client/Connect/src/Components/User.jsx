import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import
import PropTypes from "prop-types";
import {
  socket,
  connectSocket,
  disconnectSocket,
} from "../Socket/socketService";

function User({ selectedUser }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [sender, setSender] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
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
        setUsername(selectedUser.username);
        console.log(username); // Fetch initial messages
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        const response2 = await axios.get(
          `http://localhost:3000/messages/${selectedUser._id}`,
          { withCredentials: true }
        );
        console.log(response2);
        setMessages(response2.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    socket.on("msg", (messageData) => {
      console.log("New message received:", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });
    fetchData();
    fetchMessages();
    return () => {
      socket.off("msg");
      // Clean up the socket connection
    };
  }, [navigate, selectedUser, userId, username]);

  useEffect(() => {
    if (sender) {
      socket.emit("register", sender); // Emit register event when sender is set
    }
  }, [sender]);

  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);
  const sendMessage = () => {
    if (message && username) {
      const messageData = {
        from: sender,
        to: selectedUser.username,
        message: message,
      };
      console.log(messageData.from, messageData.to, messageData.message);
      socket.emit("message", messageData); // Emit message event
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col w-3/4 gap-3 p-3">
      <div>
        {user ? (
          <div>
            <h1>{username}</h1>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

      <div className="flex rounded-md bg-slate-400 flex-col h-full overflow-y-auto gap-2 px-2 py-3">
        {loading ? (
          <button
            type="button"
            className="bg-indigo-500 text-white font-bold py-2 px-2 rounded disabled:opacity-50"
            disabled
          >
            <svg className="animate-spin h-5 w-3 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4zm8-8a8 8 0 018 8h-2a6 6 0 00-6-6V4z"
              ></path>
            </svg>
            Processing...
          </button>
        ) : (
          messages.map((msg, index) =>
            msg.from === sender ? (
              <div className="flex justify-end gap-2" key={index}>
                <div className="flex rounded-tl-2xl rounded-tr-2xl rounded-br-2xl p-2 bg-lime-400 w-1/3">
                  {msg.message}
                </div>
              </div>
            ) : (
              <div className="" key={index}>
                <div className="rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl p-2 bg-slate-200 w-1/3">
                  {msg.message}
                </div>
              </div>
            )
          )
        )}
      </div>
      <div className="flex gap-1 justify-center">
        <input
          className="w-3/4"
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
