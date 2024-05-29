import './App.css'
import {Routes,Route} from 'react-router-dom'
import Login from "./Components/Login"
import Dashboard from './Components/Dashboard'
import User from './Components/User'
import Signup from './Components/Signup'
import HomePage from './Components/HomePage'
function App() {


  return (
    <>
    
     <Routes>
      <Route path='/login' Component={Login}/>
      <Route path='/signup' Component={Signup}/>
      <Route path='/dashboard' Component={Dashboard}/>
      <Route path='/:userId' Component={User}/>
      <Route path='/' Component={HomePage}/>
     </Routes>  
    </>
  )
}

export default App
