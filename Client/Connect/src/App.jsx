import './App.css'
import {Routes,Route} from 'react-router-dom'
import Login from "./Components/Login"
import Dashboard from './Components/Dashboard'
import User from './Components/User'
import Signup from './Components/Signup'
import HomePage from './Components/HomePage'
import Navbar from './Components/Navbar'
import { useEffect, useState } from 'react'
import authContext from './Context/AuthContext'
import axios from 'axios'
function App() {
  const [isAuthenticated,setAuthenticated]=useState(false);
   

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
     const token=localStorage.getItem('token');
     setAuthenticated(token);
    };

    checkAuth();
  }, []);

  return (
    <authContext.Provider value={{isAuthenticated,setAuthenticated}}>
      <div className=' flex flex-col h-full  '>
    <Navbar />
     <Routes>
      <Route className='h-screen' path='/login' element={<Login />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='/dashboard' element={<Dashboard />}/>
      <Route path='/:userId' element={<User />}/>
      <Route path='/' element={<HomePage />}/>
     </Routes>  
    </div>
    </authContext.Provider>
    
  )
}

export default App
