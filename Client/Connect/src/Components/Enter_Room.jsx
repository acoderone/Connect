import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Enter_Room() {
    const [roomId,setRoomId]=useState('');
    const [passKey,setPasskey]=useState('');
    const navigate=useNavigate();
    
 const handleRoom=async()=>{
  const response=await axios.post("http://localhost:3000/messages/enterRoom",{
    roomId,passKey
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
    <div className='flex justify-center h-screen items-center flex-col gap-2'>
      <input placeholder='roomID' className='border rounded-sm h-8 p-2 border-blue-400 focus:outline-none focus:ring-2  focus:ring-blue' onChange={(e)=>setRoomId(e.target.value)}/>
      <input placeholder='password' className='border rounded-sm h-8 p-2 border-blue-400 focus:outline-none focus:ring-2  focus:ring-blue' type='password' onChange={(e)=>setPasskey(e.target.value)}/>
      <button className='border rounded-sm border-blue-400 hover:border-blue-700 w-16' onClick={()=>handleRoom()}>Enter</button>
    </div>
  )
}

export default Enter_Room
