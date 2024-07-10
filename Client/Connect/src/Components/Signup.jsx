import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
function Signup() {
    const navigate = useNavigate();
    let [username,setUsername]=useState('');
    let[password,setPassword]=useState('');
    let [email,setEmail]=useState('');
    let[name,setName]=useState('');
    const Signup=async(e)=>{
        e.preventDefault();
       const response=await axios.post("http://localhost:3000/signup",{
        username,
        password,
        email,
        name
       })
       console.log(response);
       if(response.status===200){
         navigate('/');
       }
    }
  return (
    <div>
    <h1>Sign Up</h1>
    <input placeholder='username' onChange={(e)=>setUsername(e.target.value)} />
      
      <input placeholder='email' onChange={(e)=>setEmail(e.target.value)} />
      <input placeholder='name' onChange={(e)=>setName(e.target.value)}/>
      <input placeholder='password' type='password' onChange={(e)=>setPassword(e.target.value)}/>
      <button onClick={Signup}>Signup</button>
    </div>
  )
}

export default Signup
