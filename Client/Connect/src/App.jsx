import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import User from "./Components/User";
import Signup from "./Components/Signup";
import Navbar from "./Components/Navbar";
import { useEffect, useState } from "react";
import authContext from "./Context/AuthContext";
import Room from "./Components/Room";
import Room_messaging from "./Components/Room_messaging";
import Enter_Room from "./Components/Enter_Room";
import './index.css';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      setAuthenticated(token);
    };

    checkAuth();
  }, []);

  return (
    <authContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      <div className="flex flex-col  h-screen">
        <Navbar />
        <div className="flex-grow overflow-hidden">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/:userId" element={<User />} />
            <Route path="/room" element={<Room />} />
            <Route path="/room/:roomId" element={<Room_messaging />} />
            <Route path="/enterRoom" element={<Enter_Room />} />
          </Routes>
        </div>
      </div>
    </authContext.Provider>
  );
}

export default App;
