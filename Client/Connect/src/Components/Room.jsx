import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Room() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [passkey, setPasskey] = useState("");
  const handleRoomCreation = async () => {
    const response = await axios.post(
      "http://localhost:3000/messages/room",
      {
        roomId,
        passkey,
      },
      {
        withCredentials: true,
      }
    );

    if (response.status == 200) {
      console.log("Room Created");
      navigate("/enterroom");
    } else {
      console.error("Error in room creation");
    }
  };
  return (
    <div className="flex  justify-center  h-full  items-center">
      <div className="login_banner flex w-1/2   bg-blue-200 h-full justify-center items-center flex-col">
        <div className="h-16 w-16 animate-bounce">
          <img src="https://cdn.pixabay.com/photo/2012/04/15/21/17/speech-35342_640.png" />
        </div>
        <div className="text-5xl  font-extrabold">Connect</div>

        <div className="font-light font-sans">Feel The Power of Connecting</div>
      </div>
      <div className="flex flex-col items-center gap-10 justify-center  h-full w-1/2 py-10  bg-blue-100">
        <div className="font-mono text-3xl text-blue-500">
          <h1>Create Room</h1>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex justify-center  items-center flex-col gap-2">
            
              <input
                className="border rounded-sm h-8 p-2 border-blue-400 focus:outline-none focus:ring-2  focus:ring-blue"
                placeholder="RoomID"
                onChange={(e) => setRoomId(e.target.value)}
              />
              <input
                className="border rounded-sm h-8 p-2 border-blue-400 focus:outline-none focus:ring-2  focus:ring-blue"
                type="password"
                placeholder="Passkey"
                onChange={(e) => setPasskey(e.target.value)}
              />
              <button onClick={handleRoomCreation}>Create</button>
            </div>
          </div>
        </div>
      </div>
    
  );
}

export default Room;
