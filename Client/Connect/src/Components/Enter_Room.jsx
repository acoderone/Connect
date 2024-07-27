import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Enter_Room() {
  const [roomId, setRoomId] = useState("");
  const [passKey, setPasskey] = useState("");
  const navigate = useNavigate();

  const handleRoom = async () => {
    const response = await axios.post(
      "http://localhost:3000/messages/enterRoom",
      {
        roomId,
        passKey,
      },
      {
        withCredentials: true,
      }
    );
    console.log(response);
    if (response.status == 200) {
      navigate(`/room/${roomId}`);
      console.log("Entered the room");
    } else {
      console.log("Room is not present");
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
          <h1>Enter Room</h1>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex justify-center  items-center flex-col gap-2">
            <input
              placeholder="roomID"
              className="border rounded-sm h-8 p-2 border-blue-400 focus:outline-none focus:ring-2  focus:ring-blue"
              onChange={(e) => setRoomId(e.target.value)}
            />
            <input
              placeholder="password"
              className="border rounded-sm h-8 p-2 border-blue-400 focus:outline-none focus:ring-2  focus:ring-blue"
              type="password"
              onChange={(e) => setPasskey(e.target.value)}
            />
            <button
              className="border rounded-sm border-blue-400 hover:border-blue-700 w-16"
              onClick={() => handleRoom()}
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Enter_Room;
