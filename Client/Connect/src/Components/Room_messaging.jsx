import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ['websocket'], // Ensure WebSocket transport is used
  autoConnect: true,
});

function Room() {
  const { roomId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.connect();
    socket.emit('join room', roomId); 
    const fetchRoomMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/messages/roomMessages/${roomId}`,
          { withCredentials: true }
        );
        console.log(response.data)
       setMessages(response.data);
      } catch (error) {
        console.error('Error fetching room messages:', error);
      }
    };

    fetchRoomMessages();

    // Listen for incoming messages
    socket.on('room_message', (messageData) => {
      console.log("New message received:", messageData);
        setMessages((prevMessages) => [...prevMessages, messageData]);
      
    });

    return () => {
      socket.off("room_message");
      socket.disconnect();  // Clean up the socket connection
    };
  }, [roomId]);

  const sendMessage = () => {
   
      const messageData = {
        roomId: roomId,
        message: message
      };
      socket.emit('room_message', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage(''); // Clear the input field
    
   
  };

  return (
    <div>
      <input
        placeholder="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        <h1>Messages</h1>
        {messages.map((msg, index) => (
          <div key={index}>{msg.message}</div>
        ))}
      </div>
    </div>
  );
}

export default Room;
