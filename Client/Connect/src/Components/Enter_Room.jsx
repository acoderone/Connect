import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Enter_Room() {
    const [roomId,setRoomId]=useState('');
    const navigate=useNavigate();
 const handleRoom=(roomId)=>{
   navigate(`/room/${roomId}`);
 }
  return (
    <div>
      <input onChange={(e)=>setRoomId(e.target.value)}/>
      <button onClick={()=>handleRoom(roomId)}>Enter</button>
    </div>
  )
}

export default Enter_Room
