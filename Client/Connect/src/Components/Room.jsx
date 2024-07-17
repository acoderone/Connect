import React, { useState } from 'react'
import axios from 'axios';

function Room() {
    const [roomId,setRoomId]=useState('');
    const handleRoomCreation=async()=>{
      const response=await axios.post("http://localhost:3000/messages/room",{
        roomId
      },{
        withCredentials:true
      })

     if(response.status==200){
      console.log("Room Created");
     }
     else{
      console.error("Error in room creation");
     }
    }
  return (
    <div>
      <input onChange={(e)=>setRoomId(e.target.value)}/>
      <button onClick={handleRoomCreation}>Create</button>
    </div>
  )
}

export default Room;
