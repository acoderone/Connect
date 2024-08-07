import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import PropTypes from "prop-types";
import useSound from "use-sound";
import mySound from "../assets/happy-pop-2-185287.mp3";
import {
  socket,
  connectSocket,
  disconnectSocket,
} from "../Socket/socketService";

// eslint-disable-next-line react/prop-types
function User({ selectedUser,setHighlighted }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [sender, setSender] = useState("");
  const [loading, setLoading] = useState(true);
  const MessageRef = useRef(null);
  const [userID, setUserID] = useState(null);
  const [id, setId] = useState();
 
  const [playsound] = useSound(mySound);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    } else if (token) {
      const decodedToken = jwtDecode(token);
      setSender(decodedToken.user._id);
    }
setUserID(userId);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/users/${selectedUser}`,
          { withCredentials: true }
        );
        setId(response.data.user._id);
       
        setUser(response.data.user);
        setUsername(response.data.user._id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        const response2 = await axios.get(
          `http://localhost:3000/messages/${selectedUser}`,
          { withCredentials: true }
        );
        setMessages(response2.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
      scrollToBottom();
    };

    socket.on("msg", (messageData) => {
      playsound();
      if (messageData.from === userID) {
       setHighlighted(messageData.from);
        setMessages((prevMessages) => [...prevMessages, messageData]);
      }
    });

    fetchData();
    fetchMessages();

    return () => {
      socket.off("msg");
    };
  }, [navigate, selectedUser, sender, username, userId, userID]);

  useEffect(() => {
    if (sender) {
      socket.emit("register", sender);
    }
  }, [sender]);

  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (message && username) {
      const messageData = {
        from: sender,
        to: username,
        message: message,
      };
      socket.emit("message", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage("");
     // playsound();
    }
  };

  const scrollToBottom = () => {
    if (MessageRef.current) {
      MessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-3 h-full w-full p-3">
      <div>
        {user ? (
          <div>
            <h1>{user.username}</h1>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

      <div className="flex rounded-md bg-slate-200 flex-col w-full h-full flex-grow overflow-y-auto gap-2 px-2 py-3">
        {loading ? (
          <h1>Processing...</h1>
        ) : (
          messages.map((msg, index) =>
            msg.from === sender ? (
              <div
                ref={MessageRef}
                className="flex justify-end break-words text-wrap gap-2"
                key={index}
              >
                <div className="inline-block rounded-2xl p-2 bg-blue-400 break-words max-w-xs">
                  {msg.message}
                </div>
              </div>
            ) : (
              <div ref={MessageRef} className="justify-start gap-2" key={index}>
                <div className="inline-block rounded-2xl p-2 bg-white break-words max-w-xs">
                  {msg.message}
                </div>
              </div>
            )
          )
        )}
      </div>

      <div className="flex gap-1 justify-center">
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow border rounded-full h-8 p-2 px-3 text-md border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white rounded-full px-4"
        >
          Send
        </button>
      </div>
    </div>
  );
}

User.propTypes = {
  selectedUser: PropTypes.string.isRequired,
};

export default User;
