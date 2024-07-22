import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Room() {
  const navigate=useNavigate();
    const [roomId,setRoomId]=useState('');
    const[passkey,setPasskey]=useState('');
    const handleRoomCreation=async()=>{
      const response=await axios.post("http://localhost:3000/messages/room",{
        roomId,passkey
      },{
        withCredentials:true
      })

     if(response.status==200){
      console.log("Room Created");
      navigate('/enterroom');
     }
     else{
      console.error("Error in room creation");
     }
    }
  return (
    <div>
      <input placeholder="RoomID" onChange={(e)=>setRoomId(e.target.value)}/>
      <input type='password' placeholder='Passkey' onChange={(e)=>setPasskey(e.target.value)}/>
      <button onClick={handleRoomCreation}>Create</button>
    </div>
  )
}

export default Room;
