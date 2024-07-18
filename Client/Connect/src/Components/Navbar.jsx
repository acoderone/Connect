import React,{useContext} from "react";
import { Link } from "react-router-dom";
import authContext from "../Context/AuthContext";
import axios from "axios";
const Navbar = () => {
const {isAuthenticated,setAuthenticated}=useContext(authContext);
const handleSignout=async()=>{
  const response=await axios.post("http://localhost:3000/auth/logout",{}, { withCredentials: true });
  if(response.status==200){
    localStorage.removeItem('token');
    setAuthenticated(false);
  }

 
}
  return (
    <div className="bg-black h-10 ">
      <div className="px-10 ">
        <div className="flex justify-between items-center">
          <div className="text-2xl  font-bold text-blue-600 right-3/4">Connect</div>
          <div className=" left-3/4 space-x-4 text-blue-600  font-medium">
          <Link to="/enterroom">Room</Link>
          { (!isAuthenticated)?<Link to="/signup">Sign up</Link>:<></>
            
            }
           
           { isAuthenticated?
            <Link onClick={handleSignout} to="/">Logout</Link>:
            <Link to='/login'>Sign in</Link>}
            <Link to="/profile">Profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
