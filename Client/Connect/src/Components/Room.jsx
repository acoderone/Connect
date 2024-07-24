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
    <div className='flex flex-col justify-center h-screen items-center'>
      <input className='border rounded-sm h-8 p-2 border-blue-400 focus:outline-none focus:ring-2  focus:ring-blue' placeholder="RoomID" onChange={(e)=>setRoomId(e.target.value)}/>
      <input className='border rounded-sm h-8 p-2 border-blue-400 focus:outline-none focus:ring-2  focus:ring-blue' type='password' placeholder='Passkey' onChange={(e)=>setPasskey(e.target.value)}/>
      <button onClick={handleRoomCreation}>Create</button>
    </div>
  )
}

export default Room;
