import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
function Login() {
    const navigate = useNavigate();
    let [username,setUsername]=useState('');
    let[password,setPassword]=useState('');
    const Signin=async(e)=>{
        e.preventDefault();
       const response=await axios.post("http://localhost:3000/login",{
        username,
        password
       },{
        withCredentials:true
       })
       
       if(response.status===200){
        
        const token=response.data.token;
        
        if(token){
          localStorage.setItem('token',token);
        }
        
          
         navigate('/');
       }
    }
  return (
    <div>
    <h1>Login</h1>
      <input onChange={(e)=>setUsername(e.target.value)} />
      <input onChange={(e)=>setPassword(e.target.value)}/>
      <button onClick={Signin}>Signin</button>
    </div>
  )
}

export default Login
