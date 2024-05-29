import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
function Signup() {
    const navigate = useNavigate();
    let [username,setUsername]=useState('');
    let[password,setPassword]=useState('');
    const Signin=async(e)=>{
        e.preventDefault();
       const response=await axios.post("http://localhost:3000/signup",{
        username,
        password
       })
       console.log(response);
       if(response.status===200){
         navigate('/');
       }
    }
  return (
    <div>
    <h1>Sign Up</h1>
      <input onChange={(e)=>setUsername(e.target.value)} />
      <input onChange={(e)=>setPassword(e.target.value)}/>
      <button onClick={Signin}>Signin</button>
    </div>
  )
}

export default Signup