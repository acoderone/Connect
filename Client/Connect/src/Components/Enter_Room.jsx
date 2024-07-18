import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Enter_Room() {
    const [roomId,setRoomId]=useState('');
    const navigate=useNavigate();
    
 const handleRoom=async(roomId)=>{
  const response=await axios.post("http://localhost:3000/messages/enterRoom",{
    roomId
  },{
    withCredentials:true
  })
  console.log(response);
 if(response.status==200)
 {
  navigate(`/room/${roomId}`);
  console.log(
    "Entered the room"
  )
 }
   
  else{
    console.log("Room is not present")
  }
 }
  return (
    <div>
      <input onChange={(e)=>setRoomId(e.target.value)}/>
      <button onClick={()=>handleRoom(roomId)}>Enter</button>
    </div>
  )
}

export default Enter_Room
