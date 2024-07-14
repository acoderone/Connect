import './App.css'
import {Routes,Route} from 'react-router-dom'
import Login from "./Components/Login"
import Dashboard from './Components/Dashboard'
import User from './Components/User'
import Signup from './Components/Signup'
import HomePage from './Components/HomePage'
import Navbar from './Components/Navbar'
function App() {


  return (
    <div className=' flex flex-col h-full  '>
    <Navbar />
     <Routes>
      <Route className='h-screen' path='/login' Component={Login}/>
      <Route path='/signup' Component={Signup}/>
      <Route path='/dashboard' Component={Dashboard}/>
      <Route path='/:userId' Component={User}/>
      <Route path='/' Component={HomePage}/>
     </Routes>  
    </div>
  )
}

export default App
